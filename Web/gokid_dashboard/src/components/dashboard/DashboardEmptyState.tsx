import { CircleDashed } from 'lucide-react';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
}

export function DashboardEmptyState({ title, description }: DashboardEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <CircleDashed className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-base font-bold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}