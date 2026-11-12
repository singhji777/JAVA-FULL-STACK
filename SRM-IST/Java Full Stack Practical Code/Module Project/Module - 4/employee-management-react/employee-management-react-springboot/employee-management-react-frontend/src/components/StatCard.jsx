export default function StatCard({ label, value, hint, icon }) {
  return (
    <section className="stat-card">
      <div className="stat-icon" aria-hidden="true">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-hint">{hint}</p>
      </div>
    </section>
  );
}
