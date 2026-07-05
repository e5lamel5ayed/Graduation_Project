import { Card, CardContent } from '@/src/components/ui/Card';
import type { MetricTone } from './types';

function toneClassName(tone: MetricTone) {
  switch (tone) {
    case 'emerald':
      return 'from-emerald-500 to-teal-500 text-white';
    case 'violet':
      return 'from-violet-500 to-fuchsia-500 text-white';
    case 'amber':
      return 'from-amber-500 to-orange-500 text-white';
    case 'rose':
      return 'from-rose-500 to-pink-500 text-white';
    case 'cyan':
      return 'from-cyan-500 to-sky-500 text-white';
    case 'blue':
    default:
      return 'from-blue-500 to-indigo-500 text-white';
  }
}

interface DashboardMetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: MetricTone;
}

export function DashboardMetricCard({ label, value, helper, icon: Icon, tone = 'blue' }: DashboardMetricCardProps) {
  return (
    <Card className="h-full overflow-hidden rounded-3xl border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="relative flex h-full min-h-40 flex-col gap-4 p-5 sm:p-6">
        <div className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${toneClassName(tone)} shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="pr-14 sm:pr-16">
          <p className="max-w-44 text-[11px] font-bold uppercase tracking-[0.16em] leading-4 text-slate-500 sm:max-w-none">
            {label}
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
        </div>

        <div className="mt-auto h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />
      </CardContent>
    </Card>
  );
}