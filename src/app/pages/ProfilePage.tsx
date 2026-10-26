import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateCredentials, updateProfile } from "../../features/auth/authSlice";
import { useToast } from "../toast";
import { getErrorMessage } from "../utils/api";
import {
  hasErrors,
  validateCellNumber,
  validateEmail,
  validatePassword,
  validateRequired,
} from "../utils/validation";
import Avatar from "../components/Avatar/Avatar";
import TextInput from "../components/TextInput/TextInput";
import Button from "../components/Button/Button";
import "./ProfilePage.css";

type Errors = Record<string, string | undefined>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const notify = useToast();
  const user = useAppSelector((state) => state.auth.user);

  // Personal details form
  const [details, setDetails] = useState({
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    cellNumber: user?.cellNumber ?? "",
  });
  const [detailErrors, setDetailErrors] = useState<Errors>({});
  const [savingDetails, setSavingDetails] = useState(false);

  // Login credentials form
  const [credentials, setCredentials] = useState({
    email: user?.email ?? "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [credentialErrors, setCredentialErrors] = useState<Errors>({});
  const [credentialFormError, setCredentialFormError] = useState("");
  const [savingCredentials, setSavingCredentials] = useState(false);

  if (!user) return null;

  const handleDetailsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
  };

  const handleCredentialsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSaveDetails = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = {
      name: validateRequired(details.name, "Name"),
      surname: validateRequired(details.surname, "Surname"),
      cellNumber: validateCellNumber(details.cellNumber),
    };
    setDetailErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSavingDetails(true);
    try {
      await dispatch(updateProfile({ id: user.id, ...details })).unwrap();
      notify("success", "Profile updated.");
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setSavingDetails(false);
    }
  };

  const handleSaveCredentials = async (event: FormEvent) => {
    event.preventDefault();
    setCredentialFormError("");

    const wantsNewPassword = credentials.newPassword !== "" || credentials.confirmNewPassword !== "";
    const nextErrors = {
      email: validateEmail(credentials.email),
      currentPassword: validateRequired(credentials.currentPassword, "Current password"),
      newPassword: wantsNewPassword ? validatePassword(credentials.newPassword) : undefined,
      confirmNewPassword:
        wantsNewPassword && credentials.confirmNewPassword !== credentials.newPassword
          ? "Passwords don't match."
          : undefined,
    };
    setCredentialErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSavingCredentials(true);
    try {
      const updated = await dispatch(
        updateCredentials({
          id: user.id,
          currentPassword: credentials.currentPassword,
          email: credentials.email,
          newPassword: wantsNewPassword ? credentials.newPassword : undefined,
        })
      ).unwrap();
      setCredentials({
        email: updated.email,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      notify("success", "Login details updated.");
    } catch (error) {
      setCredentialFormError(getErrorMessage(error));
    } finally {
      setSavingCredentials(false);
    }
  };

  return (
    <div className="profile">
      <header className="profile-header">
        <Avatar name={`${user.name} ${user.surname}`} size="md" />
        <div>
          <h1 className="profile-title">
            {user.name} {user.surname}
          </h1>
          <p className="profile-meta">
            {user.email} · {user.cellNumber}
          </p>
        </div>
      </header>

      <div className="profile-grid">
        <section className="profile-card" aria-labelledby="details-heading">
          <h2 id="details-heading">Personal details</h2>
          <p className="profile-hint">How your name and number appear on your account.</p>
          <form className="form-stack" onSubmit={handleSaveDetails} noValidate>
            <div className="form-row">
              <TextInput
                label="Name"
                name="name"
                value={details.name}
                error={detailErrors.name}
                onChange={handleDetailsChange}
              />
              <TextInput
                label="Surname"
                name="surname"
                value={details.surname}
                error={detailErrors.surname}
                onChange={handleDetailsChange}
              />
            </div>
            <TextInput
              label="Cell number"
              name="cellNumber"
              type="tel"
              value={details.cellNumber}
              error={detailErrors.cellNumber}
              onChange={handleDetailsChange}
            />
            <div className="profile-actions">
              <Button type="submit" loading={savingDetails}>
                Save details
              </Button>
            </div>
          </form>
        </section>

        <section className="profile-card" aria-labelledby="credentials-heading">
          <h2 id="credentials-heading">Login details</h2>
          <p className="profile-hint">
            Change your email or password. Enter your current password to confirm it's you.
          </p>
          <form className="form-stack" onSubmit={handleSaveCredentials} noValidate>
            {credentialFormError && (
              <p className="form-error" role="alert">
                {credentialFormError}
              </p>
            )}
            <TextInput
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={credentials.email}
              error={credentialErrors.email}
              onChange={handleCredentialsChange}
            />
            <TextInput
              label="Current password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={credentials.currentPassword}
              error={credentialErrors.currentPassword}
              onChange={handleCredentialsChange}
            />
            <TextInput
              label="New password (leave blank to keep current)"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={credentials.newPassword}
              error={credentialErrors.newPassword}
              onChange={handleCredentialsChange}
            />
            <TextInput
              label="Confirm new password"
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={credentials.confirmNewPassword}
              error={credentialErrors.confirmNewPassword}
              onChange={handleCredentialsChange}
            />
            <div className="profile-actions">
              <Button type="submit" loading={savingCredentials}>
                Update login details
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
