import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import { useAppDispatch } from "../hooks";
import { registerUser } from "../../features/auth/authSlice";
import { useToast } from "../toast";
import { getErrorMessage } from "../utils/api";
import {
  hasErrors,
  validateCellNumber,
  validateEmail,
  validatePassword,
  validateRequired,
} from "../utils/validation";
import AuthCard from "../components/AuthCard/AuthCard";
import TextInput from "../components/TextInput/TextInput";
import Button from "../components/Button/Button";

const emptyForm = {
  name: "",
  surname: "",
  email: "",
  cellNumber: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const notify = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // One change handler for every field, keyed by the input's name.
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {
      name: validateRequired(form.name, "Name"),
      surname: validateRequired(form.surname, "Surname"),
      email: validateEmail(form.email),
      cellNumber: validateCellNumber(form.cellNumber),
      password: validatePassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? undefined : "Passwords don't match.",
    };
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await dispatch(
        registerUser({
          name: form.name,
          surname: form.surname,
          email: form.email,
          cellNumber: form.cellNumber,
          password: form.password,
        })
      ).unwrap();
      notify("success", `Account created. Welcome, ${user.name}!`);
      // The new user is now logged in, so PublicRoute redirects to the home page.
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start tracking what you need to buy."
      footer={
        <>
          Already registered? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <div className="form-row">
          <TextInput
            label="Name"
            name="name"
            autoComplete="given-name"
            value={form.name}
            error={errors.name}
            onChange={handleChange}
          />
          <TextInput
            label="Surname"
            name="surname"
            autoComplete="family-name"
            value={form.surname}
            error={errors.surname}
            onChange={handleChange}
          />
        </div>
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
        />
        <TextInput
          label="Cell number"
          name="cellNumber"
          type="tel"
          autoComplete="tel"
          placeholder="e.g. 082 123 4567"
          value={form.cellNumber}
          error={errors.cellNumber}
          onChange={handleChange}
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={handleChange}
        />
        <TextInput
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
