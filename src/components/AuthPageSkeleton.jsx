export default function AuthPageSkeleton({ title = "অ্যাকাউন্ট" }) {
  return (
    <div
      role="status"
      aria-label={`${title} ফর্ম লোড হচ্ছে`}
      className="min-h-[70vh] flex items-center justify-center py-10"
    >
      <div className="w-full max-w-md animate-pulse">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="h-7 w-36 rounded-lg bg-slate-200" />
          <div className="h-4 w-52 rounded bg-slate-200" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          {title === "নিবন্ধন" && (
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-11 w-full rounded-lg bg-slate-100" />
            </div>
          )}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          <div className="h-11 w-full rounded-lg bg-green-100" />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-11 rounded-lg bg-slate-100" />
            <div className="h-11 rounded-lg bg-slate-100" />
          </div>
          <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
        </div>
      </div>
      <span className="sr-only">লোড হচ্ছে…</span>
    </div>
  );
}
