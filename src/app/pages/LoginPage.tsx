import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useAppDispatch } from "../hooks";
import { loginUser } from "../../features/auth/authSlice";
import { useToast } from "../toast";
import { getErrorMessage } from "../utils/api";
import { hasErrors, validateEmail, validateRequired } from "../utils/validation";
import AuthCard from "../components/AuthCard/AuthCard";
import TextInput from "../components/TextInput/TextInput";
import Button from "../components/Button/Button";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const notify = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = {
      email: validateEmail(email),
      password: validateRequired(password, "Password"),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    try {
      const user = await dispatch(loginUser({ email, password })).unwrap();
      notify("success", `Welcome back, ${user.name}!`);
      // PublicRoute sees the logged-in user and redirects to the home page.
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your shopping lists."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextInput
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
