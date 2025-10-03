export default function LoadingMovie() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-6 w-40 bg-gray-800/60 rounded animate-pulse" />
      <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/40">
        <div className="h-10 w-2/3 bg-gray-800/60 rounded mb-4 animate-pulse" />
        <div className="h-4 w-1/3 bg-gray-800/50 rounded mb-6 animate-pulse" />
        <div className="h-24 bg-gray-800/40 rounded animate-pulse" />
      </div>
      <div className="h-7 w-48 bg-gray-800/60 rounded animate-pulse" />
      <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40">
        <div className="h-16 bg-gray-800/40 rounded animate-pulse" />
      </div>
    </div>
  );
}
