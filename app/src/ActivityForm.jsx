import { useState } from "react";

const EMPTY = { name: "", description: "", price: "", duration: "", rating: 0, link: "" };

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star === value ? 0 : star)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: "0 0.05rem",
            color: star <= (hovered || value) ? "#f6ad55" : "#e2e8f0",
            transition: "color 0.1s",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ActivityForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#f7fafc",
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      padding: "0.85rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}>
      <input
        autoFocus
        placeholder="Nom de l'activité *"
        value={form.name}
        onChange={e => set("name", e.target.value)}
        style={inputStyle}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => set("description", e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          placeholder="Prix (€)"
          value={form.price}
          onChange={e => set("price", e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <input
          placeholder="Durée (ex: 2h)"
          value={form.duration}
          onChange={e => set("duration", e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
      </div>
      <input
        placeholder="Lien (site, réservation…)"
        value={form.link}
        onChange={e => set("link", e.target.value)}
        style={inputStyle}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.78rem", color: "#718096" }}>Envie :</span>
        <StarRating value={form.rating} onChange={v => set("rating", v)} />
      </div>
      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ ...btnStyle, background: "#e2e8f0", color: "#4a5568" }}>
          Annuler
        </button>
        <button type="submit" style={{ ...btnStyle, background: "#3182ce", color: "#fff" }}>
          Sauvegarder
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.35rem 0.6rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: 6,
  fontSize: "0.85rem",
  fontFamily: "inherit",
  outline: "none",
  background: "white",
};

const btnStyle = {
  border: "none",
  borderRadius: 6,
  padding: "0.35rem 0.8rem",
  cursor: "pointer",
  fontSize: "0.82rem",
  fontWeight: 600,
};
