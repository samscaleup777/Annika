"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAllProducts } from "@/lib/api";
import {
  LIVE_DATA_AUTO_REFRESH,
  LIVE_DATA_REFRESH_INTERVAL_MS,
} from "@/lib/live-data-config";

const LiveProductsContext = createContext([]);

export function useLiveProducts() {
  return useContext(LiveProductsContext);
}

export default function LiveProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    let inFlight = false;

    const refreshProducts = async () => {
      if (!active || inFlight) return;
      inFlight = true;

      try {
        const latestProducts = await getAllProducts();
        // Keep the latest successful data if the API is temporarily empty or unavailable.
        if (active && Array.isArray(latestProducts) && latestProducts.length > 0) {
          setProducts(latestProducts);
        }
      } catch (error) {
        console.warn("BazarDor live product refresh failed:", error);
      } finally {
        inFlight = false;
      }
    };

    // Always fetch once on page load; the setting controls only periodic refreshes.
    refreshProducts();

    const intervalId = LIVE_DATA_AUTO_REFRESH
      ? window.setInterval(
          refreshProducts,
          Math.max(15_000, Number(LIVE_DATA_REFRESH_INTERVAL_MS) || 60_000)
        )
      : null;

    return () => {
      active = false;
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <LiveProductsContext.Provider value={products}>
      {children}
    </LiveProductsContext.Provider>
  );
}
