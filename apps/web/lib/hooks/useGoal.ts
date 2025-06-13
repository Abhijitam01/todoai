import { useEffect, useState } from "react";
import api from "../api";

export function useGoal(id: string | undefined) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/goals/${id}`)
      .then(res => setData(res.data))
      .catch(err => {
        setError(err);
        console.error("Failed to fetch goal:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
} 