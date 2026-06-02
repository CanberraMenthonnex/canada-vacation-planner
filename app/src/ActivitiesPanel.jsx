import { useState } from "react";
import { useActivities } from "./useActivities";
import ActivityCard from "./ActivityCard";
import ActivityForm from "./ActivityForm";

export default function ActivitiesPanel({ nightDate }) {
  const { activities, loading, addActivity, updateActivity, deleteActivity } = useActivities(nightDate);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const count = activities.length;

  return (
    <div style={{ marginTop: "0.5rem", marginLeft: 102 }}>
      {/* Toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "0.75rem",
          color: count > 0 ? "#4a5568" : "#a0aec0",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <span style={{ fontSize: "0.65rem" }}>{open ? "▼" : "▶"}</span>
        {count > 0 ? `Activités (${count})` : "Ajouter des activités"}
      </button>

      {open && (
        <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {loading ? (
            <div style={{ fontSize: "0.78rem", color: "#a0aec0" }}>Chargement…</div>
          ) : (
            activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onUpdate={fields => updateActivity(activity.id, fields)}
                onDelete={() => deleteActivity(activity.id)}
              />
            ))
          )}

          {adding ? (
            <ActivityForm
              onSave={fields => { addActivity(fields); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{
                background: "none",
                border: "1.5px dashed #cbd5e0",
                borderRadius: 8,
                padding: "0.45rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#a0aec0",
                textAlign: "center",
              }}
            >
              + Nouvelle activité
            </button>
          )}
        </div>
      )}
    </div>
  );
}
