import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState("");

  const refreshData = async () => {
    const [employeePage, departmentList] = await Promise.all([
      api.employees({ page: 0, size: 1000, sortBy: "name", direction: "asc" }),
      api.departments()
    ]);
    setEmployees(employeePage.content || []);
    setDepartments(departmentList || []);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await api.me();
        if (!active) return;
        setUser(current);
        const [employeePage, departmentList] = await Promise.all([
          api.employees({ page: 0, size: 1000, sortBy: "name", direction: "asc" }),
          api.departments()
        ]);
        if (!active) return;
        setEmployees(employeePage.content || []);
        setDepartments(departmentList || []);
      } catch {
        // A logged-out session is expected when opening the app for the first time.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = async (username, password) => {
    setAppError("");
    const result = await api.login(username, password);
    setUser({ username: result.username, role: result.role });
    await refreshData();
    return true;
  };

  const logout = async () => {
    try { await api.logout(); } finally {
      setUser(null);
      setEmployees([]);
      setDepartments([]);
    }
  };

  const saveEmployee = async (employee) => {
    if (employee.id) await api.updateEmployee(employee.id, employee);
    else await api.createEmployee(employee);
    await refreshData();
  };

  const deleteEmployee = async (id) => {
    await api.deleteEmployee(id);
    await refreshData();
  };

  const addDepartment = async (name) => {
    await api.createDepartment(name);
    await refreshData();
    return true;
  };

  const value = useMemo(() => ({
    user, login, logout, employees, departments, saveEmployee,
    deleteEmployee, addDepartment, refreshData, loading, appError, setAppError
  }), [user, employees, departments, loading, appError]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
