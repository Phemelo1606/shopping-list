import type { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode; // e.g. an "Add item" button
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action}
    </div>
  );
}
