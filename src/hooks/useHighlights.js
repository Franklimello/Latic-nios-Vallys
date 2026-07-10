"use client";

import { useCallback, useEffect, useState } from "react";
import { getHighlights } from "@/services/firebase";

export function useHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHighlights();
      setHighlights(data);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      reload();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reload]);

  return { highlights, loading, error, reload };
}
