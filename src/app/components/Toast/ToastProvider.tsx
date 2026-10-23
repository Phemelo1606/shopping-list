import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "../../toast";
import type { NotifyFn } from "../../toast";
import { ToastContainer } from "./Toast";
import type { ToastMessage } from "./Toast";

// Wrap the app once; any component can then call useToast() to show a notification.
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback<NotifyFn>((type, message) => {
    setToasts((current) => [...current, { id: nextId.current++, type, message }]);
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
