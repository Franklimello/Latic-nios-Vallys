"use client";

import { useCallback, useEffect, useState } from "react";
import { getProducts } from "@/services/firebase";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts();
      setProducts(data);
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

  return { products, loading, error, reload };
}
