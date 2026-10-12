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

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন।");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("একটি সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }

    setLoading(true);
    try {
      const config = await getAuthConfiguration();
      if (!config?.databaseConfigured || !config?.secretConfigured) {
        toast.error("লগইন সার্ভার এখনো প্রস্তুত নয়। Vercel-এ MONGODB_URI সেটআপ করতে হবে।");
        return;
      }

      const result = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      });

      if (result?.error) {
        toast.error(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
        return;
      }

      toast.success("লগইন সফল হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.error("লগইন করা যায়নি। ইমেইল, পাসওয়ার্ড ও সার্ভার সেটআপ যাচাই করুন।");
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = async (provider) => {
    setSocialLoading(provider);
    try {
      const config = await getAuthConfiguration();
      if (!config?.databaseConfigured || !config?.secretConfigured) {
        toast.error("লগইন সার্ভার প্রস্তুত নয়। Vercel-এ MONGODB_URI সেটআপ করতে হবে।");
        setSocialLoading("");
        return;
      }

      if (!config?.[provider]?.configured) {
        const vars = provider === "google"
          ? "GOOGLE_CLIENT_ID ও GOOGLE_CLIENT_SECRET"
          : "GITHUB_CLIENT_ID ও GITHUB_CLIENT_SECRET";
        toast.error(`${provider === "google" ? "Google" : "GitHub"} login চালু করতে Vercel-এ ${vars} যোগ করুন।`);
        setSocialLoading("");
        return;
      }

      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=login",
        newUserCallbackURL: "/?auth=registered",
        errorCallbackURL: "/signin?auth=error",
      });

      if (result?.error) {
        toast.error(result.error.message || `${provider} login ব্যর্থ হয়েছে।`);
        setSocialLoading("");
      }
    } catch (error) {
      console.error(provider + " sign-in failed:", error);
      toast.error(`${provider === "google" ? "Google" : "GitHub"} login শুরু করা যায়নি। OAuth configuration যাচাই করুন।`);
      setSocialLoading("");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">লগইন</h1>
          <p className="text-sm text-slate-500">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700 mb-1.5">ইমেইল</label>
              <input
                id="signin-email"
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
              <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700 mb-1.5">পাসওয়ার্ড</label>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-500">অথবা সোশ্যাল অ্যাকাউন্ট দিয়ে লগইন</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => socialSignIn("google")}
              disabled={!!socialLoading || loading}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              <span className="font-bold text-base text-blue-600">G</span>
              {socialLoading === "google" ? "সংযোগ হচ্ছে..." : "Google"}
            </button>
            <button
              type="button"
              onClick={() => socialSignIn("github")}
              disabled={!!socialLoading || loading}
              className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.51.4.35.75 1.02.75 2.06v3.05c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
              {socialLoading === "github" ? "সংযোগ হচ্ছে..." : "GitHub"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-600 mt-5">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="text-green-600 hover:underline font-medium">নিবন্ধন করুন</Link>
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          <Link href="/" className="hover:text-green-600">← হোম পেজে ফিরে যান</Link>
        </p>
      </div>
    </div>
  );
}
