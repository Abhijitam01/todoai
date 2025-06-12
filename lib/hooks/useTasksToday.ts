import { useEffect, useState } from "react";
import api from "../api";

export function useTasksToday() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/tasks/today")
      .then(res => setData(res.data))
      .catch(err => {
        setError(err);
        console.error("Failed to fetch today's tasks:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} 