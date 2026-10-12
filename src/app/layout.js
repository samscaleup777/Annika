import { Noto_Sans_Bengali } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import LiveProductsProvider from "@/components/LiveProductsProvider";
import { Toaster } from "react-hot-toast";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার দাম — বাংলাদেশের বিভিন্ন বাজারের আজকের দাম ও পরিবর্তন এক জায়গায়।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={notoBengali.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Suspense fallback={<div className="h-28 bg-white border-b border-slate-200" aria-hidden="true" />}>
          <Navbar />
        </Suspense>
        <LiveProductsProvider>
          <Ticker />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
            {children}
          </main>
        </LiveProductsProvider>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
