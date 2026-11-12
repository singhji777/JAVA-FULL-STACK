import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Layout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="topbar">
        <NavLink className="brand" to="/dashboard">Employee Management</NavLink>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/departments">Departments</NavLink>
        </nav>
        <div className="user-area">
          <span className="user-label">{user?.username} <span className="role-pill">{user?.role}</span></span>
          <button className="button button-light button-small" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="footer">Employee Management System · React Front End</footer>
    </>
  );
}
