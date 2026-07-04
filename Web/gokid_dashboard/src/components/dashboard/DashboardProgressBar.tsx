interface DashboardProgressBarProps {
  value: number;
  fillClassName: string;
}

export function DashboardProgressBar({ value, fillClassName }: DashboardProgressBarProps) {
  const filledSegments = Math.min(20, Math.max(0, Math.round((value / 100) * 20)));

  return (
    <div className="flex h-2.5 gap-1">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className={`flex-1 rounded-full ${index < filledSegments ? fillClassName : 'bg-slate-100'}`}
        />
      ))}
    </div>
  );
}