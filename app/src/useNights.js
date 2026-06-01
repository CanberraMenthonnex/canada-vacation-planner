import { useState, useEffect } from "react";
import { INITIAL_NIGHTS } from "./data";

const STORAGE_KEY = "canada-trip-nights";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useNights() {
  const [nights, setNights] = useState(() => loadFromStorage() ?? INITIAL_NIGHTS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nights));
  }, [nights]);

  function updateNight(date, patch) {
    setNights(prev =>
      prev.map(n => (n.date === date ? { ...n, ...patch } : n))
    );
  }

  return { nights, updateNight };
}
