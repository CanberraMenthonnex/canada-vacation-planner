export default function StatsBar({ nights }) {
  const total     = nights.length;
  const confirmed = nights.filter(n => n.confirmed).length;
  const withLink  = nights.filter(n => n.link && !n.confirmed).length;
  const empty     = total - confirmed - withLink;

  const priced    = nights.filter(n => n.price !== "" && n.price !== undefined);
  const totalEur  = priced.reduce((sum, n) => sum + Number(n.price), 0);
  const confirmedEur = nights
    .filter(n => n.confirmed && n.price !== "" && n.price !== undefined)
    .reduce((sum, n) => sum + Number(n.price), 0);

  return (
    <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      {[
        { label: "Nuits totales",       value: total,     color: "#4a5568" },
        { label: "✅ Confirmées",        value: confirmed, color: "#2b6cb0" },
        { label: "🔗 Lien sans confirm", value: withLink,  color: "#38a169" },
        { label: "⬜ À compléter",       value: empty,     color: "#a0aec0" },
      ].map(({ label, value, color }) => (
        <div key={label} style={chipStyle}>
          {label} : <strong style={{ color }}>{value}</strong>
        </div>
      ))}

      {priced.length > 0 && (
        <div style={{ ...chipStyle, borderLeft: "3px solid #3182ce" }}>
          💰 Total estimé : <strong style={{ color: "#3182ce" }}>{totalEur.toLocaleString("fr-FR")} €</strong>
          {confirmedEur > 0 && confirmedEur !== totalEur && (
            <span style={{ color: "#718096", marginLeft: "0.4rem", fontWeight: 400, fontSize: "0.78rem" }}>
              (dont {confirmedEur.toLocaleString("fr-FR")} € confirmés)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const chipStyle = {
  background: "white",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
  fontSize: "0.82rem",
  color: "#718096",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  flexWrap: "wrap",
};
