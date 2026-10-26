import { useId } from "react";
import type { ChangeEvent } from "react";
import FormField from "../FormField/FormField";
import "./SelectInput.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: SelectOption[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  ariaLabel?: string; // use when there is no visible label (e.g. the sort dropdown)
  error?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean; // small pill style for toolbars
}

export default function SelectInput({
  options,
  label,
  ariaLabel,
  error,
  placeholder,
  compact = false,
  ...selectProps
}: SelectInputProps) {
  const id = useId();
  const className = [
    "select-input",
    compact ? "select-input--compact" : "",
    error ? "select-input--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormField label={label} error={error} htmlFor={id}>
      <select
        id={id}
        className={className}
        aria-label={label ? undefined : ariaLabel}
        aria-invalid={Boolean(error)}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
