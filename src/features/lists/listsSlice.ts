import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../app/utils/api";
import { logout } from "../auth/authSlice";



export interface ShoppingList {
  id: number;
  userId: number; // owner
  name: string;
  sharedWith: string[]; // emails of other users who can view and edit this list
  createdAt: string;
}


export interface ShoppingItem {
  id: number;
  userId: number;
  listId: number;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  imageUrl?: string;
  bought: boolean;
  createdAt: string;
}

export type NewItemInput = Pick<
  ShoppingItem,
  "userId" | "listId" | "name" | "quantity" | "notes" | "category" | "imageUrl"
>;
export type ItemChanges = Partial<
  Pick<ShoppingItem, "name" | "quantity" | "notes" | "category" | "imageUrl" | "bought">
>;

interface ListsState {
  lists: ShoppingList[];
  items: ShoppingItem[];
  status: "idle" | "loading" | "failed"| "succeeded" ;
}

const initialState: ListsState = { lists: [], items: [], status: "idle" };

type ThunkConfig = { rejectValue: string };

export const fetchLists = createAsyncThunk<
  { lists: ShoppingList[]; items: ShoppingItem[] },
  { userId: number; email: string },
  ThunkConfig
>("lists/fetch", async ({ userId, email }, { rejectWithValue }) => {
  try {
    const [allLists, allItems] = await Promise.all([
      api.get<ShoppingList[]>("/lists"),
      api.get<ShoppingItem[]>("/items"),
    ]);
    const lists = allLists.filter(
      (list) => list.userId === userId || list.sharedWith.includes(email)
    );
    const listIds = new Set(lists.map((list) => list.id));
    return { lists, items: allItems.filter((item) => listIds.has(item.listId)) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createList = createAsyncThunk<
  ShoppingList,
  { userId: number; name: string },
  ThunkConfig
>("lists/create", async ({ userId, name }, { rejectWithValue }) => {
  try {
    return await api.post<ShoppingList>("/lists", {
      userId,
      name: name.trim(),
      sharedWith: [],
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const renameList = createAsyncThunk<
  ShoppingList,
  { id: number; name: string },
  ThunkConfig
>("lists/rename", async ({ id, name }, { rejectWithValue }) => {
  try {
    return await api.patch<ShoppingList>(`/lists/${id}`, { name: name.trim() });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Deletes a list and all of its items (json-server doesn't cascade on its own).
export const deleteList = createAsyncThunk<
  { id: number },
  { id: number; itemIds: number[] },
  ThunkConfig
>("lists/delete", async ({ id, itemIds }, { rejectWithValue }) => {
  try {
    await Promise.all(itemIds.map((itemId) => api.delete(`/items/${itemId}`)));
    await api.delete(`/lists/${id}`);
    return { id };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface ShareInput {
  listId: number;
  email: string;
  sharedWith: string[]; // the list's current recipients
  ownerEmail?: string;
}

export const shareList = createAsyncThunk<ShoppingList, ShareInput, ThunkConfig>(
  "lists/share",
  async ({ listId, email, sharedWith, ownerEmail }, { rejectWithValue }) => {
    try {
      const target = email.trim().toLowerCase();
      if (target === ownerEmail) return rejectWithValue("That's your own email address.");
      if (sharedWith.includes(target)) {
        return rejectWithValue("This list is already shared with that person.");
      }
      const matches = await api.get<{ id: number }[]>(
        `/users?email=${encodeURIComponent(target)}`
      );
      if (matches.length === 0) {
        return rejectWithValue("No account uses that email yet. Ask them to register first.");
      }
      return await api.patch<ShoppingList>(`/lists/${listId}`, {
        sharedWith: [...sharedWith, target],
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const unshareList = createAsyncThunk<ShoppingList, ShareInput, ThunkConfig>(
  "lists/unshare",
  async ({ listId, email, sharedWith }, { rejectWithValue }) => {
    try {
      return await api.patch<ShoppingList>(`/lists/${listId}`, {
        sharedWith: sharedWith.filter((shared) => shared !== email),
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addItem = createAsyncThunk<ShoppingItem, NewItemInput, ThunkConfig>(
  "items/add",
  async (input, { rejectWithValue }) => {
    try {
      return await api.post<ShoppingItem>("/items", {
        ...input,
        name: input.name.trim(),
        notes: input.notes?.trim() || undefined,
        bought: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateItem = createAsyncThunk<
  ShoppingItem,
  { id: number; changes: ItemChanges },
  ThunkConfig
>("items/update", async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await api.patch<ShoppingItem>(`/items/${id}`, changes);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteItem = createAsyncThunk<{ id: number }, number, ThunkConfig>(
  "items/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const replaceList = (state: ListsState, updated: ShoppingList) => {
  state.lists = state.lists.map((list) => (list.id === updated.id ? updated : list));
};

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = action.payload.lists;
        state.items = action.payload.items;
      })
      .addCase(fetchLists.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(renameList.fulfilled, (state, action) => replaceList(state, action.payload))
      .addCase(shareList.fulfilled, (state, action) => replaceList(state, action.payload))
      .addCase(unshareList.fulfilled, (state, action) => replaceList(state, action.payload))
      .addCase(deleteList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((list) => list.id !== action.payload.id);
        state.items = state.items.filter((item) => item.listId !== action.payload.id);
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      })
      // Never leave one user's lists in memory for the next person to log in.
      .addCase(logout, () => initialState);
  },
});

export default listsSlice.reducer;