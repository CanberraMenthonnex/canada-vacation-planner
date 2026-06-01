import { useNights } from "./useNights";
import NightCard from "./NightCard";
import StatsBar from "./StatsBar";

export default function App() {
  const { nights, updateNight, loading } = useNights();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <header style={{
        background: "linear-gradient(135deg, #c53030 0%, #9b2c2c 55%, #744210 100%)",
        color: "white",
        padding: "1.75rem 2rem",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "1.8rem", letterSpacing: "0.04em", margin: 0 }}>🍁 Vacances Canada</h1>
        <p style={{ marginTop: "0.3rem", opacity: 0.85, fontSize: "0.9rem" }}>
          31 juillet – 14 août 2026
        </p>
      </header>

      <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#a0aec0", padding: "2rem", fontSize: "0.9rem" }}>
            Chargement…
          </div>
        )}
        <StatsBar nights={nights} />

        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {nights.map((night, i) => (
            <NightCard
              key={night.date}
              night={night}
              index={i + 1}
              total={nights.length}
              onChange={patch => updateNight(night.date, patch)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
