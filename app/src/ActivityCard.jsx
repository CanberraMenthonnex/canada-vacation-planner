import { useState } from "react";
import ActivityForm from "./ActivityForm";

function Stars({ value }) {
  return (
    <span style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= value ? "#f6ad55" : "#e2e8f0" }}>★</span>
      ))}
    </span>
  );
}

export default function ActivityCard({ activity, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <ActivityForm
        initial={activity}
        onSave={fields => { onUpdate(fields); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div style={{
      background: "white",
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      padding: "0.7rem 0.85rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a202c" }}>
            {activity.name}
          </span>
          {activity.rating > 0 && (
            <span style={{ marginLeft: "0.4rem" }}>
              <Stars value={activity.rating} />
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
          <button onClick={() => setEditing(true)} style={iconBtn}>✏️</button>
          {confirmDelete ? (
            <>
              <button onClick={() => onDelete()} style={{ ...iconBtn, background: "#fed7d7", color: "#c53030", fontSize: "0.72rem", padding: "0.2rem 0.4rem" }}>
                Confirmer
              </button>
              <button onClick={() => setConfirmDelete(false)} style={iconBtn}>✕</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ ...iconBtn, color: "#fc8181" }}>🗑</button>
          )}
        </div>
      </div>

      {/* Meta chips */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {activity.price && (
          <span style={chip("#ebf8ff", "#2b6cb0")}>{activity.price} €</span>
        )}
        {activity.duration && (
          <span style={chip("#fefcbf", "#744210")}>⏱ {activity.duration}</span>
        )}
      </div>

      {/* Description */}
      {activity.description && (
        <p style={{ fontSize: "0.8rem", color: "#4a5568", margin: 0, lineHeight: 1.4 }}>
          {activity.description}
        </p>
      )}

      {/* Link */}
      {activity.link && (
        <a
          href={activity.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.75rem", color: "#3182ce", textDecoration: "none" }}
        >
          ↗ Voir le site
        </a>
      )}
    </div>
  );
}

const iconBtn = {
  background: "#f7fafc",
  border: "none",
  borderRadius: 5,
  padding: "0.2rem 0.35rem",
  cursor: "pointer",
  fontSize: "0.85rem",
};

function chip(bg, color) {
  return {
    background: bg,
    color,
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "0.1rem 0.45rem",
    borderRadius: 20,
  };
}
