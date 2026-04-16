export function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 backdrop-blur">
        <span className="size-2 animate-pulse rounded-full bg-sky-400" />
        Loading panel...
      </div>
    </div>
  )
}
