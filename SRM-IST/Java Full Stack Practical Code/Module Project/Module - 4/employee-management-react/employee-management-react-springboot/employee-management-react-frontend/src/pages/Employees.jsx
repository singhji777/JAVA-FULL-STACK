import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Employees() {
  const { employees, departments, user, deleteEmployee } = useApp();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return employees.filter((employee) => {
      const department = departments.find((d) => d.id === Number(employee.departmentId))?.name || "";
      return [employee.name, employee.email, department].some((value) => String(value).toLowerCase().includes(term));
    }).sort((a, b) => {
      const av = sortBy === "department" ? (departments.find((d) => d.id === Number(a.departmentId))?.name || "") : a[sortBy];
      const bv = sortBy === "department" ? (departments.find((d) => d.id === Number(b.departmentId))?.name || "") : b[sortBy];
      const comparison = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return direction === "asc" ? comparison : -comparison;
    });
  }, [employees, departments, search, sortBy, direction]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleEmployees = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const changeSort = (field) => {
    if (sortBy === field) setDirection((old) => old === "asc" ? "desc" : "asc");
    else { setSortBy(field); setDirection("asc"); }
    setPage(0);
  };
  const departmentName = (id) => departments.find((d) => d.id === Number(id))?.name || "Unassigned";
  const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="page-wrap">
      <div className="page-title-row"><div><p className="eyebrow">PEOPLE DIRECTORY</p><h1>Employees</h1><p className="muted">Manage employee records and team information.</p></div>{user?.role === "HR" && <Link to="/employees/new" className="button button-primary">＋ Add employee</Link>}</div>
      <section className="panel">
        <div className="toolbar"><div className="search-box"><span>⌕</span><input aria-label="Search employees" placeholder="Search by name, email, department..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} /></div><span className="result-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>EMPLOYEE</th><th>EMAIL</th><th><button className="sort-button" onClick={() => changeSort("department")}>DEPARTMENT {sortBy === "department" ? (direction === "asc" ? "↑" : "↓") : "↕"}</button></th><th><button className="sort-button" onClick={() => changeSort("salary")}>SALARY {sortBy === "salary" ? (direction === "asc" ? "↑" : "↓") : "↕"}</button></th><th>ACCESS</th><th>ACTIONS</th></tr></thead>
          <tbody>{visibleEmployees.map((employee) => <tr key={employee.id}><td><div className="employee-cell"><span className="avatar">{initials(employee.name)}</span><div><strong>{employee.name}</strong><small>EMP-{String(employee.id).padStart(3, "0")}</small></div></div></td><td className="email-cell">{employee.email}</td><td><span className="department-pill">{departmentName(employee.departmentId)}</span></td><td className="salary-cell">{Number(employee.salary).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</td><td><span className="status-pill"><span /> Active</span></td><td><div className="actions">{(user?.role === "HR" || user?.role === "MANAGER") && <Link className="action-link" to={`/employees/edit/${employee.id}`}>Edit</Link>}{user?.role === "HR" && <button className="action-delete" onClick={() => { if (window.confirm(`Delete ${employee.name}?`)) deleteEmployee(employee.id); }}>Delete</button>}{user?.role === "EMPLOYEE" && <span className="muted">View only</span>}</div></td></tr>)}
          {visibleEmployees.length === 0 && <tr><td colSpan="6" className="empty-state"><span>⌕</span><strong>No employees found</strong><p>Try a different search term.</p></td></tr>}</tbody></table></div>
        <div className="table-footer"><span>Showing {filtered.length === 0 ? 0 : currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, filtered.length)} of {filtered.length}</span><div className="pagination"><button disabled={currentPage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>← Previous</button><span>Page <strong>{currentPage + 1}</strong> of {totalPages}</span><button disabled={currentPage + 1 >= totalPages} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next →</button></div></div>
      </section>
      <p className="permission-note">Your role: <strong>{user?.role}</strong> · {user?.role === "HR" ? "Full employee management access" : user?.role === "MANAGER" ? "Can view and edit employee records" : "View-only access"}</p>
    </div>
  );
}
