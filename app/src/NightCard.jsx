import { useState, useEffect, useRef } from "react";

const DAY_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_FR = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return `${DAY_FR[d.getDay()]} ${d.getDate()} ${MONTH_FR[d.getMonth()]}`;
}

function statusOf(night) {
  if (night.confirmed) return "confirmed";
  if (night.link)      return "booked";
  if (night.city && night.city !== "À définir") return "located";
  return "empty";
}

const STATUS_STYLE = {
  confirmed: { border: "#2b6cb0", bg: "#ebf8ff" },
  booked:    { border: "#38a169", bg: "#f0fff4" },
  located:   { border: "#d69e2e", bg: "#fffff0" },
  empty:     { border: "#cbd5e0", bg: "#fff"    },
};

export default function NightCard({ night, index, total, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    city:      night.city,
    link:      night.link,
    price:     night.price ?? "",
    confirmed: night.confirmed ?? false,
  });
  const [notes, setNotes] = useState(night.notes ?? "");
  const [showNotes, setShowNotes] = useState(false);
  const debounceRef = useRef(null);

  // Sync fields when Supabase data loads (initial state is from INITIAL_NIGHTS, real data arrives async)
  useEffect(() => {
    setNotes(night.notes ?? "");
    if (!editing) {
      setDraft({
        city:      night.city,
        link:      night.link,
        price:     night.price ?? "",
        confirmed: night.confirmed ?? false,
      });
    }
  }, [night.city, night.link, night.price, night.confirmed, night.notes]);

  const status = statusOf(night);
  const style  = STATUS_STYLE[status];

  function save() {
    onChange({ ...draft });
    setEditing(false);
  }

  function cancel() {
    setDraft({ city: night.city, link: night.link, price: night.price ?? "", confirmed: night.confirmed ?? false });
    setEditing(false);
  }

  function toggleConfirmed() {
    onChange({ confirmed: !night.confirmed });
  }

  function handleNotesChange(e) {
    const value = e.target.value;
    setNotes(value);
    // Debounce save to Supabase by 800ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ notes: value });
    }, 800);
  }

  return (
    <div style={{
      background: style.bg,
      borderLeft: `4px solid ${style.border}`,
      borderRadius: 10,
      padding: "0.85rem 1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    }}>
      {/* Top row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr auto",
        gap: "0.75rem",
        alignItems: "start",
      }}>
        {/* Date */}
        <div style={{ paddingTop: "0.1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#718096", fontWeight: 600 }}>
            Nuit {index}/{total}
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#2d3748", lineHeight: 1.3 }}>
            {formatDate(night.date)}
          </div>
        </div>

        {/* Content */}
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <input
              autoFocus
              value={draft.city}
              onChange={e => setDraft(d => ({ ...d, city: e.target.value }))}
              placeholder="Ville / lieu / hôtel"
              style={inputStyle}
            />
            <input
              value={draft.link}
              onChange={e => setDraft(d => ({ ...d, link: e.target.value }))}
              placeholder="Lien de réservation"
              style={inputStyle}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <input
                type="number"
                min="0"
                value={draft.price}
                onChange={e => setDraft(d => ({ ...d, price: e.target.value }))}
                placeholder="Prix / nuit (EUR)"
                style={{ ...inputStyle, width: 170 }}
              />
              <span style={{ fontSize: "0.82rem", color: "#718096" }}>EUR</span>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#4a5568", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={draft.confirmed}
                onChange={e => setDraft(d => ({ ...d, confirmed: e.target.checked }))}
              />
              Réservation confirmée
            </label>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, color: "#1a202c", fontSize: "0.95rem" }}>
                {night.city || <span style={{ color: "#a0aec0", fontStyle: "italic" }}>—</span>}
              </span>
              {night.price !== "" && night.price !== undefined && (
                <span style={{
                  background: "#ebf8ff",
                  color: "#2b6cb0",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.45rem",
                  borderRadius: 20,
                }}>
                  {night.price} €
                </span>
              )}
              {night.confirmed && (
                <span style={{
                  background: "#c6f6d5",
                  color: "#276749",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.45rem",
                  borderRadius: 20,
                }}>
                  ✓ Confirmé
                </span>
              )}
            </div>
            {night.link ? (
              <a
                href={night.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.78rem", color: "#3182ce", textDecoration: "none" }}
              >
                ↗ Voir la réservation
              </a>
            ) : (
              <span style={{ fontSize: "0.78rem", color: "#a0aec0" }}>Pas de lien</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {editing ? (
            <>
              <button onClick={save}   style={{ ...btnStyle, background: "#38a169", color: "#fff" }}>✓</button>
              <button onClick={cancel} style={{ ...btnStyle, background: "#e2e8f0", color: "#4a5568" }}>✕</button>
            </>
          ) : (
            <>
              <button
                onClick={toggleConfirmed}
                title={night.confirmed ? "Marquer non confirmé" : "Marquer confirmé"}
                style={{
                  ...btnStyle,
                  background: night.confirmed ? "#c6f6d5" : "#edf2f7",
                  color:      night.confirmed ? "#276749" : "#a0aec0",
                  fontSize: "1rem",
                }}
              >
                ✓
              </button>
              <button onClick={() => setEditing(true)} style={{ ...btnStyle, background: "#edf2f7", color: "#4a5568" }}>
                ✏️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notes toggle */}
      {!editing && (
        <div style={{ marginTop: "0.5rem", marginLeft: 102 }}>
          <button
            onClick={() => setShowNotes(v => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.75rem",
              color: notes ? "#4a5568" : "#a0aec0",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span style={{ fontSize: "0.65rem" }}>{showNotes ? "▼" : "▶"}</span>
            {notes ? "Notes" : "Ajouter une note"}
          </button>

          {showNotes && (
            <textarea
              autoFocus
              value={notes}
              onChange={handleNotesChange}
              placeholder="Notes, idées, activités prévues…"
              rows={3}
              style={{
                marginTop: "0.4rem",
                width: "100%",
                padding: "0.4rem 0.6rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: 6,
                fontSize: "0.82rem",
                fontFamily: "inherit",
                color: "#4a5568",
                resize: "vertical",
                outline: "none",
                background: "rgba(255,255,255,0.7)",
              }}
              onFocus={e => e.target.style.borderColor = "#a0aec0"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.35rem 0.6rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: 6,
  fontSize: "0.88rem",
  fontFamily: "inherit",
  outline: "none",
};

const btnStyle = {
  border: "none",
  borderRadius: 6,
  padding: "0.35rem 0.6rem",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: 600,
};
