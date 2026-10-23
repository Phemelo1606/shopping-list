import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "../Spinner/Spinner";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "md" | "sm";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  type = "button",
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? "button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}
