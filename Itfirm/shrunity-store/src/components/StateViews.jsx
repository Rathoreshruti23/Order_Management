import { AlertCircle, Loader2 } from 'lucide-react';

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-ink-soft" role="status">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center" role="alert">
      <AlertCircle className="h-6 w-6 text-red-700" aria-hidden="true" />
      <p className="text-sm text-red-900">{message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="btn btn-outline">Try again</button>}
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 flex flex-col items-center gap-4 text-ink-soft">{children}</div>
    </div>
  );
}

export function ProductSkeletons({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-2xl bg-blush-100" />
          <div className="mt-4 h-4 w-3/4 rounded bg-blush-100" />
          <div className="mt-2 h-4 w-1/3 rounded bg-blush-100" />
        </div>
      ))}
    </div>
  );
}
