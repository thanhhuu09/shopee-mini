"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CatalogError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white px-8 py-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          Something went wrong
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-950">
          We couldn&apos;t load the catalog
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {error.message || "Unknown error"}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
