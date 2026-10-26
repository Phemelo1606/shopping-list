import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../hooks";

export default function PublicRoute() {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
}