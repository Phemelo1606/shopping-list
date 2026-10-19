import { useId } from "react";
import type { ChangeEvent } from "react";
import FormField from "../FormField/FormField";
import "./TextInput.css";

interface TextInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

// One component for single-line inputs and (with multiline) textareas.
export default function TextInput({
  label,
  error,
  multiline = false,
  rows = 3,
  type = "text",
  ...fieldProps
}: TextInputProps) {
  const id = useId();
  const className = `text-input${error ? " text-input--error" : ""}`;
  const commonProps = { id, className, "aria-invalid": Boolean(error), ...fieldProps };

  return (
    <FormField label={label} error={error} htmlFor={id}>
      {multiline ? (
        <textarea rows={rows} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </FormField>
  );
}
