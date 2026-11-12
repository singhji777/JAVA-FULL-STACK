import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(username, password);
      setError("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid username or password. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-mark">EMS</div>
        <p className="eyebrow">PEOPLE OPERATIONS</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your employee workspace.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack">
          <label htmlFor="username">Username</label>
          <input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          <button className="button button-primary button-full" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <div className="demo-box">
          <strong>Demo accounts</strong>
          <p><span>HR</span><code>hr / 1234</code></p>
          <p><span>Manager</span><code>manager / 1234</code></p>
          <p><span>Employee</span><code>employee / 1234</code></p>
        </div>
        <p className="login-note">Demo only · Authentication is handled in the browser.</p>
      </section>
      <aside className="login-aside">
        <div className="aside-orb orb-one" /><div className="aside-orb orb-two" />
        <div className="aside-content">
          <span className="aside-tag">EMPLOYEE EXPERIENCE</span>
          <h2>Great teams<br />start with people.</h2>
          <p>A simple workspace to organize employees, departments, and everyday people operations.</p>
          <div className="aside-metrics"><div><strong>01</strong><span>People</span></div><div><strong>02</strong><span>Teams</span></div><div><strong>03</strong><span>Growth</span></div></div>
        </div>
      </aside>
    </main>
  );
}
