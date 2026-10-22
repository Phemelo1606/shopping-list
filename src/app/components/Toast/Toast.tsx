import { useEffect } from "react";
import "./Toast.css";

export interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps extends ToastMessage {
  onDismiss: (id: number) => void;
  duration?: number;
}

export default function Toast({ id, type, message, onDismiss, duration = 4000 }: ToastProps) {
  // Auto-dismiss after a few seconds
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div className={`toast toast--${type}`} role={type === "error" ? "alert" : "status"}>
      <p className="toast__message">{message}</p>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

// Render once (e.g. in AppLayout) and pass it the list of active toasts.
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
