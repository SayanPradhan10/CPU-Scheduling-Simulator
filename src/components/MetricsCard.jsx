export default function MetricsCard({ label, value, description, accent = 'violet' }) {
  return (
    <article className={`metric-card metric-card--${accent}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{description}</span>
    </article>
  );
}
