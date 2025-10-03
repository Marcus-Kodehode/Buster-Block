export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-64 bg-gray-800/60 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-2xl p-6 bg-gray-900/40"
          >
            <div className="h-5 w-3/4 bg-gray-800/60 rounded mb-3 animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-800/50 rounded mb-6 animate-pulse" />
            <div className="h-20 bg-gray-800/40 rounded mb-4 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-800/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
