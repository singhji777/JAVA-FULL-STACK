import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const { user, employees, departments } = useApp();
  const payroll = employees.reduce((sum, employee) => sum + Number(employee.salary || 0), 0);

  return (
    <div className="page-wrap">
      <div className="welcome-row">
        <div><p className="eyebrow">OVERVIEW</p><h1>Good day, {user?.username} <span aria-hidden="true">✦</span></h1><p className="muted">Here’s what’s happening across your organization.</p></div>
        <div className="date-chip"><span className="date-dot" /> Workspace active</div>
      </div>
      <div className="stats-grid">
        <StatCard label="Total employees" value={employees.length} hint="Across all departments" icon="♙" />
        <StatCard label="Departments" value={departments.length} hint="Teams in your organization" icon="▦" />
        <StatCard label="Monthly payroll" value={payroll.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} hint="Based on listed salaries" icon="₹" />
      </div>
      <section className="section-heading"><div><p className="eyebrow">QUICK ACCESS</p><h2>Your workspace</h2></div><span className="muted">Choose where to begin</span></section>
      <div className="quick-grid">
        <Link to="/employees" className="quick-card"><div className="quick-icon green">♙</div><div><h3>Employees <span>↗</span></h3><p>View employee records, search, sort, and manage details.</p><span className="quick-link">Open employee directory →</span></div></Link>
        <Link to="/departments" className="quick-card"><div className="quick-icon mint">▦</div><div><h3>Departments <span>↗</span></h3><p>Review your teams and keep department information organized.</p><span className="quick-link">Explore departments →</span></div></Link>
      </div>
      <div className="info-banner"><div className="info-symbol">i</div><div><strong>Demo project</strong><p>Records are held in React state and reset when the page is refreshed. Connect a backend API when you are ready.</p></div></div>
    </div>
  );
}
