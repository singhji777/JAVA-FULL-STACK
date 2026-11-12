import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Departments() {
  const { departments, employees, user, addDepartment } = useApp();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await addDepartment(name);
      setIsError(false);
      setMessage(`Department "${name.trim()}" added successfully.`);
      setName("");
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Could not add department.");
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-title-row"><div><p className="eyebrow">ORGANIZATION</p><h1>Departments</h1><p className="muted">Explore the teams that make up your organization.</p></div><span className="count-chip">{departments.length} departments</span></div>
      {user?.role === "HR" && <section className="panel add-department-panel"><div><h2>Add a department</h2><p className="muted">Create a team to organize employee records.</p></div><form className="inline-add-form" onSubmit={handleSubmit}><input aria-label="Department name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marketing" required /><button className="button button-primary" type="submit">＋ Add department</button></form>{message && <p className={isError ? "form-message error-text" : "form-message success-text"}>{message}</p>}</section>}
      <div className="department-grid">{departments.map((department, index) => {
        const count = employees.filter((employee) => Number(employee.departmentId) === department.id).length;
        const palettes = ["dept-green", "dept-blue", "dept-orange", "dept-purple"];
        return <article className="department-card" key={department.id}><div className="department-card-top"><span className={`department-icon ${palettes[index % palettes.length]}`}>▦</span><span className="department-id">DEPT-{String(department.id).padStart(2, "0")}</span></div><h2>{department.name}</h2><p className="muted">Department team</p><div className="department-card-bottom"><div><strong>{count}</strong><span> {count === 1 ? "employee" : "employees"}</span></div><Link to="/employees" className="text-link">View people →</Link></div></article>;
      })}</div>
      <div className="info-banner"><div className="info-symbol">i</div><div><strong>Department relationships</strong><p>Each employee record is linked to one department. This demo stores the relationship in React state only.</p></div></div>
    </div>
  );
}
