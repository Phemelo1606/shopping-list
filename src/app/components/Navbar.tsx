import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">Pantry List</NavLink>
      <nav className="navbar-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <span>{user?.name}</span>
        <button onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
}