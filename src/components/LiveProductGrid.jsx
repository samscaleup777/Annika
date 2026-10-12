"use client";

import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { useLiveProducts } from "@/components/LiveProductsProvider";

export default function LiveProductGrid({
  products,
  mode = "all",
  limit,
  emptyMessage = "এখন কোনো পণ্যের তথ্য পাওয়া যাচ্ছে না।",
}) {
  const latestProducts = useLiveProducts();
  const sourceProducts = latestProducts.length > 0 ? latestProducts : products;

  const visibleProducts = useMemo(() => {
    let list = [...sourceProducts];

    if (mode === "risers") {
      list = list
        .filter((product) => product.change?.dir === "up")
        .sort((a, b) => Number(b.change?.pct || 0) - Number(a.change?.pct || 0));
    } else if (mode === "fallers") {
      list = list
        .filter((product) => product.change?.dir === "down")
        .sort((a, b) => Number(a.change?.pct || 0) - Number(b.change?.pct || 0));
    }

    return Number.isInteger(limit) ? list.slice(0, limit) : list;
  }, [sourceProducts, mode, limit]);

  if (visibleProducts.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
        <div className="text-4xl mb-2">📭</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleProducts.map((product, index) => (
        <ProductCard
          key={product.id || product.slug || product._id || index}
          product={product}
        />
      ))}
    </div>
  );
}
