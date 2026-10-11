import Link from "next/link";
import CategoryListing from "@/components/CategoryListing";
import { getAllCategories, getAllProducts } from "@/lib/api";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) return <EmptyCategoryState invalid />;

  const allProducts = await getAllProducts();
  const products = allProducts.filter((product) => product.category === slug);

  return <CategoryListing category={category} products={products} />;
}

function EmptyCategoryState({ invalid = false }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-10">
      <div className="w-full max-w-xl bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-6xl mb-4" aria-hidden="true">{invalid ? "🔎" : "🧺"}</div>
        <p className="text-sm font-semibold tracking-widest text-green-700 mb-2">
          {invalid ? "404 · NOT FOUND" : "NO PRODUCTS YET"}
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          {invalid ? "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি" : "এই ক্যাটাগরিতে কোনো পণ্য নেই"}
        </h1>
        <p className="text-slate-500 mb-6">
          {invalid
            ? "লিংকটি সঠিক কি না দেখুন, অথবা হোম পেজ থেকে একটি ক্যাটাগরি বেছে নিন।"
            : "এই ক্যাটাগরিতে এখন পণ্যের তথ্য পাওয়া যাচ্ছে না। পরে আবার দেখুন।"}
        </p>
        <Link href="/" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
