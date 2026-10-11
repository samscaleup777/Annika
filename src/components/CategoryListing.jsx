"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { formatBn } from "@/lib/bn";

export default function CategoryListing({ category, products }) {
  const [sort, setSort] = useState("default");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") {
      list.sort((a, b) => (Number(a.today) || 0) - (Number(b.today) || 0));
    } else if (sort === "price-desc") {
      list.sort((a, b) => (Number(b.today) || 0) - (Number(a.today) || 0));
    }
    return list;
  }, [products, sort]);

  if (!products.length) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-10">
        <div className="w-full max-w-xl bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center">
          <div className="text-6xl mb-4" aria-hidden="true">🧺</div>
          <p className="text-sm font-semibold tracking-widest text-green-700 mb-2">NO PRODUCTS YET</p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">এই ক্যাটাগরিতে কোনো পণ্য নেই</h1>
          <p className="text-slate-500 mb-6">এই ক্যাটাগরিতে এখন পণ্যের তথ্য পাওয়া যাচ্ছে না। পরে আবার দেখুন।</p>
          <a href="/" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">হোম পেজে ফিরে যান</a>
        </div>
      </div>
    );
  }

  return (
    <section>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4 flex items-center gap-2 flex-wrap">
        <a href="/" className="hover:text-green-600">হোম</a>
        <span>›</span>
        <span className="text-slate-700">{category.nameBn}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 bg-green-50 rounded-xl flex items-center justify-center text-3xl" aria-hidden="true">
          {category.icon || "🧺"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{category.nameBn}</h1>
          <p className="text-sm text-slate-500 mt-1">আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-600">
          মোট <span className="font-semibold text-slate-800">{formatBn(sortedProducts.length)}</span> টি পণ্য দেখানো হচ্ছে
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="category-sort" className="text-sm text-slate-600 whitespace-nowrap">সাজান:</label>
          <select
            id="category-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProducts.map((product, index) => (
          <ProductCard key={product.id || product.slug || index} product={product} />
        ))}
      </div>
    </section>
  );
}
