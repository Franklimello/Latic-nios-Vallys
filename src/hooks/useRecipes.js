"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecipes } from "@/services/firebase";

export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRecipes();
      setRecipes(data);
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

  return { recipes, loading, error, reload };
}
