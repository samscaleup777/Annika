"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড দুটোই দিন");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      });

      if (result?.error) {
        toast.error(result.error.message || "সাইন ইন ব্যর্থ হয়েছে");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign-in request failed:", err);
      toast.error("সাইন ইন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">সাইন ইন</h1>
          <p className="text-sm text-slate-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                ইমেইল
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-5">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="text-green-600 hover:underline font-medium">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          ←{" "}
          <Link href="/" className="hover:text-green-600">
            হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  );
}
