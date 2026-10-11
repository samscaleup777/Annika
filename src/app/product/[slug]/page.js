import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBn, translateUnit } from "@/lib/bn";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  // Load the auth service only when a request reaches this page. This keeps
  // production builds independent of deployment-only secrets and database URLs.
  const { auth } = await import("@/lib/auth");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(`/product/${slug}`)}`);
  }

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent slug={slug} />
    </Suspense>
  );
}

async function ProductContent({ slug }) {
  let product = null;

  const urls = [
    "https://openapi.programming-hero.com/api/bazardor",
    "https://api.api-store.workers.dev/api/bazardor",
    "https://api.abcz.workers.dev/api/bazardor",
  ];

  for (const base of urls) {
    try {
      const res = await fetch(`${base}/products`, { cache: "no-store" });
      if (!res.ok) continue;
      const all = await res.json();
      if (!Array.isArray(all) || all.length === 0) continue;

      const found = all.find((p) => p.slug === slug);
      if (found) {
        product = found;
        break;
      }
    } catch (err) {
      console.error(`Failed: ${base}`, err);
      continue;
    }
  }

  if (!product) {
    notFound();
  }

  const markets = product.markets || [];

  const cleanedMarkets = markets.map((m) => {
    const min = Math.round(Number(m.min) || 0);
    const max = Math.round(Number(m.max) || 0);
    const avg = Math.round((min + max) / 2);
    return { ...m, min, max, avg };
  });

  const minPrice =
    cleanedMarkets.length > 0
      ? Math.min(...cleanedMarkets.map((m) => m.min))
      : Math.round(Number(product.today) || 0);
  const maxPrice =
    cleanedMarkets.length > 0
      ? Math.max(...cleanedMarkets.map((m) => m.max))
      : Math.round(Number(product.today) || 0);
  const avgPrice =
    cleanedMarkets.length > 0
      ? Math.round(
          cleanedMarkets.reduce((sum, m) => sum + m.avg, 0) /
            cleanedMarkets.length
        )
      : Math.round(Number(product.today) || 0);

  const dir = product.change?.dir || "flat";
  const pct = Number(product.change?.pct) || 0;
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  const badgeColor =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
      ? "bg-green-50 text-green-600"
      : "bg-slate-100 text-slate-500";

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-green-600">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-green-600"
        >
          {product.categoryNameBn}
        </Link>
        <span>›</span>
        <span className="text-slate-700">{product.nameBn}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 grid md:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{product.image}</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
              {product.nameBn}
            </h1>
            <p className="text-sm text-slate-500 mb-3">
              {translateUnit(product.unit)} • {product.categoryNameBn}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md">
                {product.categoryIcon} {product.categoryNameBn}
              </span>
              <span className="text-xs text-slate-500">
                গতকালের তুলনায় আজ দাম{" "}
                {dir === "up"
                  ? "বেড়েছে"
                  : dir === "down"
                  ? "কমেছে"
                  : "অপরিবর্তিত"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 min-w-[160px] text-center">
          <div className="text-xs text-slate-500 mb-1">আজকের দাম</div>
          <div className="num text-3xl font-bold text-slate-800">
            {formatBn(Math.round(Number(product.today) || 0))}
          </div>
          <div className="text-xs text-slate-500 mb-2">
            টাকা / {translateUnit(product.unit).replace("প্রতি ", "")}
          </div>
          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${badgeColor}`}
          >
            {arrow} {formatBn(Math.abs(pct).toFixed(1))}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label="সর্বনিম্ন দাম"
            value={minPrice}
            sub="বাজারের মধ্যে সবচেয়ে কম"
            color="green"
          />
          <SummaryCard
            label="সর্বোচ্চ দাম"
            value={maxPrice}
            sub="বাজারের মধ্যে সবচেয়ে বেশি"
            color="red"
          />
          <SummaryCard
            label="গড় দাম"
            value={avgPrice}
            sub="সব বাজারের গড়"
            color="slate"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            বাংলাদেশের {formatBn(cleanedMarkets.length)}টি বাজারে আজকের দাম
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-medium">বাজার</th>
                <th className="text-left px-6 py-3 font-medium">বিভাগ</th>
                <th className="text-right px-6 py-3 font-medium">সর্বনিম্ন</th>
                <th className="text-right px-6 py-3 font-medium">সর্বোচ্চ</th>
                <th className="text-right px-6 py-3 font-medium">গড়</th>
              </tr>
            </thead>
            <tbody>
              {cleanedMarkets.map((m, idx) => (
                <tr
                  key={idx}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-3 text-slate-800">{m.market}</td>
                  <td className="px-6 py-3 text-slate-500">{m.division}</td>
                  <td className="num px-6 py-3 text-right text-green-600 font-medium">
                    {formatBn(m.min)} টাকা
                  </td>
                  <td className="num px-6 py-3 text-right text-red-600 font-medium">
                    {formatBn(m.max)} টাকা
                  </td>
                  <td className="num px-6 py-3 text-right text-slate-700 font-medium">
                    {formatBn(m.avg)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }) {
  const colors = {
    green: "text-green-600",
    red: "text-red-600",
    slate: "text-slate-700",
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`num text-2xl font-bold ${colors[color]}`}>
        {formatBn(value)} টাকা
      </div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div>
      <div className="h-4 w-60 rounded skeleton mb-4" />
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 grid md:grid-cols-[1fr_auto] gap-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 rounded skeleton" />
            <div className="h-4 w-32 rounded skeleton" />
          </div>
        </div>
        <div className="w-40 h-24 rounded skeleton" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="h-5 w-40 rounded skeleton mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 rounded skeleton" />
          <div className="h-20 rounded skeleton" />
          <div className="h-20 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}