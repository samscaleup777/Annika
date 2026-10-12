"use client";

import { useLiveProducts } from "@/components/LiveProductsProvider";
import { formatBn, translateUnit } from "@/lib/bn";

export default function Ticker() {
  const products = useLiveProducts();

  if (products.length === 0) {
    return <div className="bg-slate-50 border-b border-slate-200 h-9" />;
  }

  // Infinite loop এর জন্য list দুইবার render করব
  const items = [...products, ...products];

  return (
    <div className="bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="animate-marquee py-2">
        {items.map((p, idx) => (
          <TickerItem key={String(p.id || p.slug || p._id || "product") + "-" + idx} product={p} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ product }) {
  const dir = product.change?.dir || "flat";
  const pct = product.change?.pct || 0;

  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  const colorClass =
    dir === "up"
      ? "text-red-600"
      : dir === "down"
      ? "text-green-600"
      : "text-slate-500";

  return (
    <div className="flex items-center gap-2 px-5 text-sm border-r border-slate-200 whitespace-nowrap flex-shrink-0">
      <span className="text-base">{product.image}</span>
      <span className="text-slate-700 font-medium">{product.nameBn}</span>
      <span className="text-slate-500">
        {formatBn(product.today)} টাকা/
        {translateUnit(product.unit).replace("প্রতি ", "")}
      </span>
      <span className={colorClass + " font-medium"}>
        {arrow} {formatBn(Math.abs(pct).toFixed(1))}%
      </span>
    </div>
  );
}
