/* eslint-disable @next/next/no-img-element */
import type { ComponentType } from 'react';

interface DashboardLeaderboardItemProps {
  rank: number;
  title: string;
  value: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  avatar?: string | null;
}

export function DashboardLeaderboardItem({ rank, title, value, subtitle, icon: Icon, avatar }: DashboardLeaderboardItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-sm font-black text-slate-700">
        {avatar ? <img src={avatar} alt={title} className="h-full w-full object-cover" /> : rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-blue-600" /> : null}
          <p className="truncate text-sm font-bold text-slate-900">{title}</p>
        </div>
        {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}