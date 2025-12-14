function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-orange-100 bg-white p-4">
      <div className="mb-4 h-40 rounded-xl bg-orange-50" />
      <div className="space-y-2">
        <div className="h-4 rounded bg-orange-100" />
        <div className="h-4 rounded bg-orange-100" />
        <div className="h-10 rounded-full bg-orange-100" />
      </div>
    </div>
  );
}

export default function LoadingCatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-8">
        <div className="mb-10 h-48 animate-pulse rounded-3xl bg-white" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
