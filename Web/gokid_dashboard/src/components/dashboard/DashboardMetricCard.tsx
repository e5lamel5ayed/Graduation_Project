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
    <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{helper}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${toneClassName(tone)} shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}