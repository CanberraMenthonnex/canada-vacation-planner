import { useState, useEffect } from "react";
import { INITIAL_NIGHTS } from "./data";
import { supabase } from "./supabase";

export function useNights() {
  const [nights, setNights] = useState(INITIAL_NIGHTS);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    supabase
      .from("nights")
      .select("*")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          // Merge DB rows into the initial nights list (preserves order)
          setNights(INITIAL_NIGHTS.map(n => {
            const row = data.find(r => r.date === n.date);
            return row ? { ...n, ...row } : n;
          }));
        }
        setLoading(false);
      });
  }, []);

  async function updateNight(date, patch) {
    // Optimistic local update
    setNights(prev => prev.map(n => (n.date === date ? { ...n, ...patch } : n)));

    // Upsert to Supabase
    await supabase
      .from("nights")
      .upsert({ date, ...patch }, { onConflict: "date" });
  }

  return { nights, updateNight, loading };
}
