import type { ReactNode } from "react";
import "./FormField.css";

interface FormFieldProps {
  htmlFor: string;
  label?: string;
  error?: string;
  children: ReactNode;
}

// Wraps any form control with a label and an error message.
export default function FormField({ htmlFor, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="form-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
