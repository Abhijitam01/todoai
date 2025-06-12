import { useEffect, useState } from "react";
import api from "../api";

export function useGoals() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/goals")
      .then(res => setData(res.data))
      .catch(err => {
        setError(err);
        console.error("Failed to fetch goals:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} 