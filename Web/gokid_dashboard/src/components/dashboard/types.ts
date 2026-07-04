import type { ComponentType } from 'react';

export type MetricTone = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export interface DashboardTrendPoint {
  year: number;
  month: number;
  monthLabel: string;
  count: number;
}

export interface DashboardChartSlice {
  label: string;
  value: number;
  color: string;
  fillClassName: string;
}

export interface DashboardLeaderboardIconProps {
  className?: string;
}

export type DashboardIconComponent = ComponentType<DashboardLeaderboardIconProps>;