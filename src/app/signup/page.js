"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!trimmedName || !normalizedEmail || !password) {
      toast.error("সব ঘর পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      if (result?.error) {
        toast.error(result.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        return;
      }

      toast.success("রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন");
      router.push("/signin");
    } catch (err) {
      console.error("Sign-up request failed:", err);
      toast.error("রেজিস্ট্রেশন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-sm text-slate-500">
            বাজার দর এ নতুন? এখনই যোগ দিন
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                নাম
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                ইমেইল
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? "অপেক্ষা করুন..." : "রেজিস্ট্রেশন করুন"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-5">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/signin" className="text-green-600 hover:underline font-medium">
              সাইন ইন করুন
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
