import type { DashboardChartSlice } from './types';

interface DashboardDonutChartProps {
  title: string;
  subtitle: string;
  centerLabel: string;
  slices: DashboardChartSlice[];
  formatCompact: (value: number) => string;
  formatPercent: (value: number) => string;
}

export function DashboardDonutChart({ title, subtitle, centerLabel, slices, formatCompact, formatPercent }: DashboardDonutChartProps) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{subtitle}</h3>
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
          No values available yet.
        </div>
      </div>
    );
  }

  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{subtitle}</h3>

      <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="relative mx-auto h-52 w-52">
          <svg viewBox="0 0 240 240" className="h-full w-full" role="img" aria-label={`${title} donut chart`}>
            <circle cx="120" cy="120" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="32" />
            {slices.map((slice, index) => {
              const sliceLength = (slice.value / total) * circumference;
              const previousLength = slices.slice(0, index).reduce((sum, previousSlice) => sum + (previousSlice.value / total) * circumference, 0);
              const dashOffset = circumference * 0.25 - previousLength;

              return (
                <circle
                  key={slice.label}
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="32"
                  strokeDasharray={`${sliceLength} ${circumference - sliceLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 120 120)"
                />
              );
            })}
            <circle cx="120" cy="120" r="58" fill="#ffffff" />
            <text x="120" y="118" textAnchor="middle" className="fill-slate-900 text-[28px] font-black">
              {formatCompact(total)}
            </text>
            <text x="120" y="142" textAnchor="middle" className="fill-slate-500 text-[11px] font-semibold uppercase tracking-[0.18em]">
              {centerLabel}
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          {slices.map((slice) => {
            const percent = (slice.value / total) * 100;
            return (
              <div key={slice.label} className="rounded-2xl bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${slice.fillClassName}`} />
                    {slice.label}
                  </span>
                  <span>{formatPercent(percent)}</span>
                </div>
                <div className="flex h-2.5 gap-1">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-full ${index < Math.min(20, Math.max(0, Math.round((percent / 100) * 20))) ? slice.fillClassName : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}