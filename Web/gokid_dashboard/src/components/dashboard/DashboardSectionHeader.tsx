import type { ReactNode } from 'react';

interface DashboardSectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: ReactNode;
}

export function DashboardSectionHeader({ eyebrow, title, description, icon: Icon, action }: DashboardSectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
          <Icon className="h-3.5 w-3.5 text-blue-600" />
          {eyebrow}
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}