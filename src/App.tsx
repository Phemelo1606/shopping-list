import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "../src/app/routes/ProtectedRoute";
import PublicRoute from "../src/app/routes/PublicRoute";
import AppLayout from "../src/app/components/AppLayout";
import LoginPage from "../src/app/pages/LoginPage";
import RegisterPage from "../src/app/pages/RegisterPage";
import HomePage from "../src/app/pages/HomePage";
import ProfilePage from "../src/app/pages/ProfilePage";

export default function App() {
  return (
    <Routes>
      {/* Only for logged-out users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Only for logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}