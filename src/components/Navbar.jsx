"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getAllCategories } from "@/lib/api";
import { todayBn } from "@/lib/bn";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    getAllCategories().then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    const authResult = searchParams.get("auth");
    if (!authResult) return;

    if (authResult === "login") {
      toast.success("লগইন সফল হয়েছে!");
    } else if (authResult === "registered") {
      toast.success("সোশ্যাল অ্যাকাউন্ট দিয়ে নিবন্ধন সফল হয়েছে!");
    } else if (authResult === "error") {
      toast.error("সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("auth");
    const remainingQuery = params.toString();
    router.replace(remainingQuery ? `${pathname}?${remainingQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const handleClick = () => setProfileOpen(false);
    if (profileOpen) {
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [profileOpen]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const result = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("সাইন আউট সফল হয়েছে");
            setProfileOpen(false);
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "সাইন আউট ব্যর্থ হয়েছে");
          },
        },
      });
      if (result?.error) {
        toast.error(result.error.message || "সাইন আউট ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Sign-out failed:", error);
      toast.error(error?.message || "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top row: Logo + Auth */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-green-600 border p-2 border-green-100 shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={44}
              height={44}
              className="w-full h-full object-contain p-1"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-slate-800">বাজার দর</div>
            <div className="text-xs text-slate-500">{todayBn()}</div>
          </div>
        </Link>

        {/* Auth buttons */}
        {isPending ? (
          <div className="w-24 h-9 bg-slate-200 rounded-lg animate-pulse" />
        ) : user ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1"
            >
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {user.name?.split(" ")[0]}
              </span>
              <span className="text-slate-400 text-xs">▾</span>
            </button>

            {profileOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-800 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {user.email}
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  👤 আমার প্রোফাইল
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 disabled:opacity-60"
                >
                  ↩ {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-green-600"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      {/* Category row */}
      <nav className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}