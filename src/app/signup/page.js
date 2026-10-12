"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

async function getAuthConfiguration() {
  try {
    const response = await fetch("/api/auth/providers", { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      toast.error("সব ঘর পূরণ করুন।");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("একটি সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const config = await getAuthConfiguration();
      if (!config?.databaseConfigured || !config?.secretConfigured) {
        toast.error("নিবন্ধন সার্ভার প্রস্তুত নয়। Vercel-এ MONGODB_URI সেটআপ করতে হবে।");
        return;
      }

      const result = await authClient.signUp.email({
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      if (result?.error) {
        toast.error(result.error.message || "নিবন্ধন করা যায়নি। তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।");
        return;
      }

      toast.success("নিবন্ধন সফল হয়েছে। এখন আপনার অ্যাকাউন্টে লগইন করুন।");
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign-up failed:", error);
      toast.error("নিবন্ধন করা যায়নি। ইমেইল ঠিকানা ও সার্ভার সেটআপ যাচাই করুন।");
    } finally {
      setLoading(false);
    }
  };

  const socialSignUp = async (provider) => {
    setSocialLoading(provider);
    try {
      const config = await getAuthConfiguration();
      if (!config?.databaseConfigured || !config?.secretConfigured) {
        toast.error("নিবন্ধন সার্ভার প্রস্তুত নয়। Vercel-এ MONGODB_URI সেটআপ করতে হবে।");
        setSocialLoading("");
        return;
      }

      if (!config?.[provider]?.configured) {
        const vars = provider === "google"
          ? "GOOGLE_CLIENT_ID ও GOOGLE_CLIENT_SECRET"
          : "GITHUB_CLIENT_ID ও GITHUB_CLIENT_SECRET";
        toast.error(`${provider === "google" ? "Google" : "GitHub"} দিয়ে নিবন্ধনের জন্য Vercel-এ ${vars} যোগ করুন।`);
        setSocialLoading("");
        return;
      }

      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=login",
        newUserCallbackURL: "/?auth=registered",
        errorCallbackURL: "/signup?auth=error",
      });

      if (result?.error) {
        toast.error(result.error.message || `${provider} দিয়ে নিবন্ধন ব্যর্থ হয়েছে।`);
        setSocialLoading("");
      }
    } catch (error) {
      console.error(provider + " sign-up failed:", error);
      toast.error(`${provider === "google" ? "Google" : "GitHub"} দিয়ে নিবন্ধন শুরু করা যায়নি। OAuth configuration যাচাই করুন।`);
      setSocialLoading("");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">নিবন্ধন করুন</h1>
          <p className="text-sm text-slate-500">বাজার দর-এ নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">নাম</label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">ইমেইল</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">পাসওয়ার্ড</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-500">অথবা সোশ্যাল অ্যাকাউন্ট দিয়ে নিবন্ধন</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => socialSignUp("google")}
              disabled={!!socialLoading || loading}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              <span className="font-bold text-base text-blue-600">G</span>
              {socialLoading === "google" ? "সংযোগ হচ্ছে..." : "Google"}
            </button>
            <button
              type="button"
              onClick={() => socialSignUp("github")}
              disabled={!!socialLoading || loading}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.51.4.35.75 1.02.75 2.06v3.05c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
              {socialLoading === "github" ? "সংযোগ হচ্ছে..." : "GitHub"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-600 mt-5">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/signin" className="text-green-600 hover:underline font-medium">লগইন করুন</Link>
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          <Link href="/" className="hover:text-green-600">← হোম পেজে ফিরে যান</Link>
        </p>
      </div>
    </div>
  );
}
