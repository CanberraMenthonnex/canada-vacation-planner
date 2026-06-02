import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useActivities(nightDate) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("activities")
      .select("*")
      .eq("night_date", nightDate)
      .order("created_at")
      .then(({ data }) => {
        setActivities(data ?? []);
        setLoading(false);
      });
  }, [nightDate]);

  async function addActivity(fields) {
    const { data } = await supabase
      .from("activities")
      .insert({ night_date: nightDate, ...fields })
      .select()
      .single();
    if (data) setActivities(prev => [...prev, data]);
  }

  async function updateActivity(id, fields) {
    setActivities(prev => prev.map(a => (a.id === id ? { ...a, ...fields } : a)));
    await supabase.from("activities").update(fields).eq("id", id);
  }

  async function deleteActivity(id) {
    setActivities(prev => prev.filter(a => a.id !== id));
    await supabase.from("activities").delete().eq("id", id);
  }

  return { activities, loading, addActivity, updateActivity, deleteActivity };
}
