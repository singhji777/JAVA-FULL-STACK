import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import EmployeeForm from "./pages/EmployeeForm.jsx";
import Departments from "./pages/Departments.jsx";
import Layout from "./components/Layout.jsx";

function ProtectedLayout() {
  const { user, loading } = useApp();
  if (loading) return <div className="loading-screen">Loading Employee Management…</div>;
  return user ? <Layout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, loading } = useApp();
  if (loading) return <div className="loading-screen">Loading Employee Management…</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
        <Route path="/departments" element={<Departments />} />
      </Route>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
