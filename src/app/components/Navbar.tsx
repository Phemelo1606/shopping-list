import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../../features/auth/authSlice";
import { useToast } from "../toast";
import Avatar from "./Avatar/Avatar";
import Button from "./Button/Button";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = useToast();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    notify("info", "You've been logged out.");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Pantry List
        </NavLink>
        <nav className="navbar-links" aria-label="Main">
          <NavLink to="/" end className="navbar-link">
            Home
          </NavLink>
          <NavLink to="/profile" className="navbar-link">
            Profile
          </NavLink>
        </nav>
        <div className="navbar-user">
          {user && <Avatar name={`${user.name} ${user.surname}`} />}
          <span className="navbar-name">{user?.name}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
