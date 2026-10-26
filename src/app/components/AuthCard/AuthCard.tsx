import type { ReactNode } from "react";
import "./AuthCard.css";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode; // e.g. "No account? Register"
}

// Shared shell for the Login and Register pages.
export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-card-brand">Pantry List</p>
        <h1 className="auth-card-title">{title}</h1>
        <p className="auth-card-subtitle">{subtitle}</p>
        {children}
        {footer && <p className="auth-card-footer">{footer}</p>}
      </div>
    </div>
  );
}
