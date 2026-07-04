import { AlertCircle, RefreshCw } from 'lucide-react';

export function DashboardLoadingState() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <div className="h-5 w-28 rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-72 rounded-2xl bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded-full bg-slate-200" />
        </div>
        <div className="h-11 w-36 rounded-2xl bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl bg-white shadow-sm" />
        ))}
      </div>
    </div>
  );
}

export function DashboardErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-6 lg:p-8">
      <div className="rounded-4xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-rose-900">Platform dashboard unavailable</h1>
            <p className="mt-2 max-w-2xl text-sm text-rose-700">{message}</p>
            <button
              onClick={onRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-500"
            >
              <RefreshCw className="h-4 w-4" />
              Retry loading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}