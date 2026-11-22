export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="space-y-3">
        <div className="bg-surface-800 h-4 w-32 rounded" />
        <div className="bg-surface-800 h-12 w-72 rounded" />
        <div className="bg-surface-800 h-4 w-full max-w-xl rounded" />
      </div>
      <div className="border-surface-800 bg-surface-900/50 rounded-card h-24 animate-pulse border" />
      <div className="border-surface-800 bg-surface-900/50 rounded-card h-96 animate-pulse border" />
    </div>
  );
}
