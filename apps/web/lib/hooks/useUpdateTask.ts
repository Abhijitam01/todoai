import { useState } from "react";
import api from "../api";

export function useUpdateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any | null>(null);

  async function updateTask(id: string, payload: any) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.patch(`/tasks/${id}`, payload);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Failed to update task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { updateTask, loading, error, data };
} 