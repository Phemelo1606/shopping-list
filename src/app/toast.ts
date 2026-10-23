import { createContext, useContext } from "react";
import type { ToastMessage } from "./components/Toast/Toast";

export type NotifyFn = (type: ToastMessage["type"], message: string) => void;

export const ToastContext = createContext<NotifyFn>(() => {});

// const notify = useToast(); notify("success", "Item added");
export const useToast = () => useContext(ToastContext);
