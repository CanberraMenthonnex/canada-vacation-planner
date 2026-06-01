import { useState, useEffect } from "react";

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

export default function LinkPreview({ url }) {
  const [meta, setMeta] = useState(null);   // { title, description, image }
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error

  useEffect(() => {
    if (!url) { setMeta(null); setStatus("idle"); return; }

    setStatus("loading");
    setMeta(null);

    const controller = new AbortController();

    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        if (data.status === "success") {
          setMeta({
            title:       data.data.title       || getDomain(url),
            description: data.data.description || "",
            image:       data.data.image?.url  || null,
          });
          setStatus("ok");
        } else {
          setStatus("error");
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [url]);

  if (!url) return null;

  if (status === "loading") {
    return (
      <div style={wrapStyle}>
        <div style={{ color: "#a0aec0", fontSize: "0.8rem", padding: "0.5rem" }}>
          Chargement de la préview…
        </div>
      </div>
    );
  }

  if (status === "error" || !meta) {
    return (
      <div style={wrapStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem" }}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`}
            width={16} height={16} alt=""
            style={{ borderRadius: 3, flexShrink: 0 }}
          />
          <span style={{ fontSize: "0.82rem", color: "#4a5568", wordBreak: "break-all" }}>
            {getDomain(url)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div style={{ ...wrapStyle, cursor: "pointer", transition: "box-shadow 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.13)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = wrapStyle.boxShadow}
      >
        <div style={{ display: "flex", gap: 0, overflow: "hidden", borderRadius: 8 }}>
          {meta.image && (
            <img
              src={meta.image}
              alt=""
              style={{
                width: 90,
                minHeight: 70,
                objectFit: "cover",
                flexShrink: 0,
                background: "#e2e8f0",
              }}
              onError={e => { e.target.style.display = "none"; }}
            />
          )}
          <div style={{ padding: "0.55rem 0.75rem", flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#1a202c",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {meta.title}
            </div>
            {meta.description && (
              <div style={{
                fontSize: "0.75rem",
                color: "#718096",
                marginTop: "0.2rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {meta.description}
              </div>
            )}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              marginTop: "0.35rem",
            }}>
              <img
                src={`https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`}
                width={12} height={12} alt=""
                style={{ borderRadius: 2, flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.7rem", color: "#a0aec0" }}>{getDomain(url)}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

const wrapStyle = {
  marginTop: "0.5rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: 8,
  overflow: "hidden",
  background: "white",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
