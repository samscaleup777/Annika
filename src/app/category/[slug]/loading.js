import { SectionSkeleton } from "@/components/Skeleton";

export default function CategoryLoading() {
  return (
    <section aria-live="polite" aria-busy="true">
      <p className="text-sm text-slate-500 mb-3">পণ্য লোড হচ্ছে… / Loading…</p>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 rounded skeleton" />
          <div className="h-4 w-56 rounded skeleton" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center justify-between gap-3">
        <div className="h-4 w-44 rounded skeleton" />
        <div className="h-9 w-48 rounded skeleton" />
      </div>
      <SectionSkeleton count={6} />
    </section>
  );
}
