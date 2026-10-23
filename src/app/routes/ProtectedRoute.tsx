import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../hooks";

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}