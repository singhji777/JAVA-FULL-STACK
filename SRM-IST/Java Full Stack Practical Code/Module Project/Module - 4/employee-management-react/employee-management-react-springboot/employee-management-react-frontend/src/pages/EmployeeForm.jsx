import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function EmployeeForm() {
  const { id } = useParams();
  const { employees, departments, user, saveEmployee } = useApp();
  const navigate = useNavigate();
  const existing = id ? employees.find((employee) => employee.id === Number(id)) : null;
  const [form, setForm] = useState({ name: "", email: "", salary: "", departmentId: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing) setForm({ name: existing.name, email: existing.email, salary: String(existing.salary), departmentId: String(existing.departmentId) });
  }, [existing]);

  if (user?.role === "EMPLOYEE" || (!id && user?.role !== "HR") || (id && user?.role !== "HR" && user?.role !== "MANAGER")) {
    return <div className="page-wrap"><div className="panel access-denied"><h2>Access restricted</h2><p>Your role does not allow this action.</p><Link className="button button-primary" to="/employees">Back to employees</Link></div></div>;
  }
  if (id && !existing) return <div className="page-wrap"><div className="panel"><h2>Employee not found</h2><Link to="/employees">Return to employee directory</Link></div></div>;

  const updateField = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (Number(form.salary) < 0) { setError("Salary cannot be negative."); return; }
    if (!departments.some((department) => department.id === Number(form.departmentId))) { setError("Please select a department."); return; }
    try {
      await saveEmployee({ ...form, id: id ? Number(id) : undefined });
      navigate("/employees");
    } catch (err) {
      setError(err.message || "Could not save employee.");
    }
  };

  return (
    <div className="page-wrap form-page">
      <div className="page-title-row"><div><p className="eyebrow">PEOPLE DIRECTORY</p><h1>{id ? "Edit employee" : "Add employee"}</h1><p className="muted">{id ? "Update employee details below." : "Create a new employee record."}</p></div><Link className="button button-outline" to="/employees">← Back</Link></div>
      <section className="panel form-panel"><div className="form-panel-heading"><span className="form-heading-icon">♙</span><div><h2>Employee information</h2><p>Fields marked with * are required.</p></div></div>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="field"><label htmlFor="name">Full name *</label><input id="name" name="name" value={form.name} onChange={updateField} placeholder="e.g. Ravi Kumar" required /></div>
          <div className="field"><label htmlFor="email">Email address *</label><input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="name@company.com" required /></div>
          <div className="field"><label htmlFor="salary">Monthly salary (₹) *</label><input id="salary" name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={updateField} placeholder="50000" required /></div>
          <div className="field"><label htmlFor="departmentId">Department *</label><select id="departmentId" name="departmentId" value={form.departmentId} onChange={updateField} required><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></div>
          <div className="form-actions"><Link to="/employees" className="button button-outline">Cancel</Link><button type="submit" className="button button-primary">{id ? "Save changes" : "Create employee"} →</button></div>
        </form>
      </section>
    </div>
  );
}
