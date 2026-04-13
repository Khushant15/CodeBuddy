export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-5 h-5 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-xs font-mono text-white/25">Loading…</p>
      </div>
    </div>
  );
}
