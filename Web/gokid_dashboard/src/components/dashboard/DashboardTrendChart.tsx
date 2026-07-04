import type { DashboardTrendPoint } from './types';

interface DashboardTrendChartProps {
  points: DashboardTrendPoint[];
}

export function DashboardTrendChart({ points }: DashboardTrendChartProps) {
  const safePoints = points.length > 0 ? points : [{ year: 0, month: 0, monthLabel: 'No data', count: 0 }];
  const maxValue = Math.max(...safePoints.map((point) => point.count), 1);
  const width = 680;
  const height = 240;
  const padding = 28;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const step = safePoints.length > 1 ? chartWidth / (safePoints.length - 1) : chartWidth / 2;

  const coordinates = safePoints.map((point, index) => {
    const x = safePoints.length > 1 ? padding + step * index : width / 2;
    const y = height - padding - (point.count / maxValue) * chartHeight;
    return { ...point, x, y };
  });

  const linePath = coordinates.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${coordinates.at(-1)?.x ?? width / 2} ${height - padding} L ${coordinates[0]?.x ?? width / 2} ${height - padding} Z`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Registration trend</p>
          <h3 className="mt-2 text-lg font-bold text-white">New users over time</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          {safePoints.length} points
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full overflow-visible" role="img" aria-label="Registration trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            x2={width - padding}
            y1={padding + chartHeight * ratio}
            y2={padding + chartHeight * ratio}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 8"
          />
        ))}

        {safePoints.length > 1 ? <path d={areaPath} fill="url(#trendFill)" /> : null}
        {safePoints.length > 1 ? <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : null}

        {coordinates.map((point, index) => (
          <g key={`${point.monthLabel}-${index}`}>
            <circle cx={point.x} cy={point.y} r="6" fill="#93c5fd" stroke="#0f172a" strokeWidth="3" />
            <text x={point.x} y={height - 6} textAnchor="middle" className="fill-slate-400 text-[11px] font-medium">
              {point.monthLabel}
            </text>
            <text x={point.x} y={point.y - 16} textAnchor="middle" className="fill-white text-[12px] font-bold">
              {point.count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}