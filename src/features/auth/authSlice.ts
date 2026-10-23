import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../app/utils/api";
import { hashPassword, verifyPassword } from "../../app/utils/password";

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
}

// What json-server stores: the user plus a bcrypt hash (never kept in Redux).
interface StoredUser extends User {
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

interface AuthState {
  user: User | null;
}

const loadUser = (): User | null => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: User | null) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
};

// Strips the password hash before a user goes anywhere near the UI.
const toUser = ({ id, email, name, surname, cellNumber }: StoredUser): User => ({
  id,
  email,
  name,
  surname,
  cellNumber,
});

const normaliseEmail = (email: string) => email.trim().toLowerCase();
const findByEmail = (email: string) =>
  api.get<StoredUser[]>(`/users?email=${encodeURIComponent(email)}`);

type ThunkConfig = { rejectValue: string };

export const registerUser = createAsyncThunk<User, RegisterInput, ThunkConfig>(
  "auth/register",
  async (input, { rejectWithValue }) => {
    try {
      const email = normaliseEmail(input.email);
      if ((await findByEmail(email)).length > 0) {
        return rejectWithValue("An account with this email already exists.");
      }
      const created = await api.post<StoredUser>("/users", {
        email,
        name: input.name.trim(),
        surname: input.surname.trim(),
        cellNumber: input.cellNumber.trim(),
        password: await hashPassword(input.password),
      });
      return toUser(created);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  ThunkConfig
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const [stored] = await findByEmail(normaliseEmail(email));
    // Same message for "no such user" and "wrong password" so emails can't be probed.
    if (!stored || !(await verifyPassword(password, stored.password))) {
      return rejectWithValue("Incorrect email or password.");
    }
    return toUser(stored);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  User,
  { id: number; name: string; surname: string; cellNumber: string },
  ThunkConfig
>("auth/updateProfile", async ({ id, name, surname, cellNumber }, { rejectWithValue }) => {
  try {
    const updated = await api.patch<StoredUser>(`/users/${id}`, {
      name: name.trim(),
      surname: surname.trim(),
      cellNumber: cellNumber.trim(),
    });
    return toUser(updated);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Changes the login email and/or password. Always requires the current password.
export const updateCredentials = createAsyncThunk<
  User,
  { id: number; currentPassword: string; email: string; newPassword?: string },
  ThunkConfig
>("auth/updateCredentials", async ({ id, currentPassword, email, newPassword }, { rejectWithValue }) => {
  try {
    const stored = await api.get<StoredUser>(`/users/${id}`);
    if (!(await verifyPassword(currentPassword, stored.password))) {
      return rejectWithValue("Your current password is incorrect.");
    }

    const newEmail = normaliseEmail(email);
    const emailChanged = newEmail !== stored.email;
    if (emailChanged && (await findByEmail(newEmail)).length > 0) {
      return rejectWithValue("That email is already used by another account.");
    }

    const changes: Partial<StoredUser> = { email: newEmail };
    if (newPassword) changes.password = await hashPassword(newPassword);
    const updated = await api.patch<StoredUser>(`/users/${id}`, changes);

    // Lists are shared by email, so keep any lists shared with the old address working.
    if (emailChanged) {
      const lists = await api.get<{ id: number; sharedWith: string[] }[]>("/lists");
      await Promise.all(
        lists
          .filter((list) => list.sharedWith.includes(stored.email))
          .map((list) =>
            api.patch(`/lists/${list.id}`, {
              sharedWith: list.sharedWith.map((e) => (e === stored.email ? newEmail : e)),
            })
          )
      );
    }
    return toUser(updated);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState: AuthState = { user: loadUser() };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      saveUser(action.payload);
    },
    logout(state) {
      state.user = null;
      saveUser(null);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        registerUser.fulfilled,
        loginUser.fulfilled,
        updateProfile.fulfilled,
        updateCredentials.fulfilled
      ),
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        saveUser(action.payload);
      }
    );
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
