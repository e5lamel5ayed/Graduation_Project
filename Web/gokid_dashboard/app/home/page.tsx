'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent } from '@/src/components/ui/Card';
import { platformDashboardService } from '@/src/services/platformDashboardService';
import type { PlatformDashboardData } from '@/src/types/platform-dashboard';
import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  Crown,
  FileCheck2,
  Gift,
  Landmark,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  UserPlus,
  Users,
  Users2,
  UsersRound,
  Clock3,
  ShieldCheck,
  RefreshCw,
  Flame,
} from 'lucide-react';
import {
  DashboardDonutChart,
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLeaderboardItem,
  DashboardLoadingState,
  DashboardMetricCard,
  DashboardProgressBar,
  DashboardSectionHeader,
  DashboardTrendChart,
} from '@/src/components/dashboard';
import { InstitutionDashboardView } from './InstitutionDashboardView';

const numberFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const percentFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const strokePalette = ['#0f766e', '#2563eb', '#7c3aed', '#f97316', '#e11d48', '#16a34a', '#0ea5e9', '#ca8a04'];
const fillPalette = ['bg-teal-600', 'bg-blue-600', 'bg-violet-500', 'bg-orange-500', 'bg-rose-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-amber-500'];

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatCompact(value: number) {
  return compactFormatter.format(value);
}

function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getGrowthLabel(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 'New growth this month' : 'No growth last month';
  }

  const delta = ((current - previous) / previous) * 100;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatPercent(delta)} vs last month`;
}

function fillClassByIndex(index: number) {
  return fillPalette[index % fillPalette.length];
}

function toneClassName(tone: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan') {
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

export default function HomePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role === 'institution') {
    return <InstitutionDashboardView />;
  }

  return <PlatformDashboardView />;
}

function PlatformDashboardView() {
  const [dashboard, setDashboard] = useState<PlatformDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await platformDashboardService.getDashboard();
      setDashboard(response);
    } catch (loadError) {
      console.error('Failed to load platform dashboard:', loadError);
      setError('Failed to load platform dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error || !dashboard) {
    return <DashboardErrorState message={error ?? 'No dashboard data returned from the server.'} onRetry={() => void loadDashboard()} />;
  }

  const d = dashboard;
  const userTotal = d.users.totalParents + d.users.totalChildren + d.users.totalSupervisors + d.users.totalInstitutionAdmins;
  const weeklyTotal = Object.values(d.adventures.weeklyByStatus).reduce((sum, item) => sum + item, 0) || 1;
  const pointsSourceTotal = d.pointsAndLevels.bySource.reduce((sum, item) => sum + item.totalPoints, 0) || 1;
  const registrationMax = Math.max(...d.users.registrationTrend.map((item) => item.count), 1);

  const roleBreakdown = [
    { label: 'Parents', value: d.users.totalParents, percent: userTotal ? (d.users.totalParents / userTotal) * 100 : 0, fillClassName: 'bg-blue-600' },
    { label: 'Children', value: d.users.totalChildren, percent: userTotal ? (d.users.totalChildren / userTotal) * 100 : 0, fillClassName: 'bg-violet-500' },
    { label: 'Supervisors', value: d.users.totalSupervisors, percent: userTotal ? (d.users.totalSupervisors / userTotal) * 100 : 0, fillClassName: 'bg-emerald-500' },
    { label: 'Institution admins', value: d.users.totalInstitutionAdmins, percent: userTotal ? (d.users.totalInstitutionAdmins / userTotal) * 100 : 0, fillClassName: 'bg-amber-500' },
  ];

  const taskStatus = [
    { label: 'Pending', value: d.tasks.assignmentsByStatus.pending, color: '#f59e0b', fillClassName: 'bg-amber-500' },
    { label: 'In progress', value: d.tasks.assignmentsByStatus.inProgress, color: '#0ea5e9', fillClassName: 'bg-cyan-500' },
    { label: 'Review requested', value: d.tasks.assignmentsByStatus.reviewRequested, color: '#8b5cf6', fillClassName: 'bg-violet-500' },
    { label: 'Completed', value: d.tasks.assignmentsByStatus.completed, color: '#10b981', fillClassName: 'bg-emerald-500' },
    { label: 'Rejected', value: d.tasks.assignmentsByStatus.rejected, color: '#ef4444', fillClassName: 'bg-rose-500' },
  ];

  const taskTypes = [
    { label: 'Instant reward', value: d.tasks.templatesByType.instantReward, percent: d.tasks.totalTemplates ? (d.tasks.templatesByType.instantReward / d.tasks.totalTemplates) * 100 : 0, fillClassName: 'bg-blue-600' },
    { label: 'Text question', value: d.tasks.templatesByType.textQuestion, percent: d.tasks.totalTemplates ? (d.tasks.templatesByType.textQuestion / d.tasks.totalTemplates) * 100 : 0, fillClassName: 'bg-violet-500' },
    { label: 'Voice question', value: d.tasks.templatesByType.voiceQuestion, percent: d.tasks.totalTemplates ? (d.tasks.templatesByType.voiceQuestion / d.tasks.totalTemplates) * 100 : 0, fillClassName: 'bg-amber-500' },
    { label: 'Evidence submission', value: d.tasks.templatesByType.evidenceSubmission, percent: d.tasks.totalTemplates ? (d.tasks.templatesByType.evidenceSubmission / d.tasks.totalTemplates) * 100 : 0, fillClassName: 'bg-teal-600' },
  ];

  const pointSources = d.pointsAndLevels.bySource.map((item, index) => ({
    label: item.source,
    value: item.totalPoints,
    color: strokePalette[index % strokePalette.length],
    fillClassName: fillClassByIndex(index),
    percent: (item.totalPoints / pointsSourceTotal) * 100,
  }));

  const levelDistribution = [...d.pointsAndLevels.levelDistribution]
    .sort((left, right) => left.order - right.order)
    .map((level, index) => ({ ...level, fillClassName: fillClassByIndex(index) }));

  const activityCards = [
    { label: 'Users', value: formatNumber(d.recentActivity.newUsers), icon: UserPlus, tone: 'blue' as const },
    { label: 'Tasks', value: formatNumber(d.recentActivity.tasksCompleted), icon: ClipboardCheck, tone: 'emerald' as const },
    { label: 'Adventures', value: formatNumber(d.recentActivity.adventuresCompleted), icon: Trophy, tone: 'violet' as const },
    { label: 'Rewards', value: formatNumber(d.recentActivity.giftsPurchased), icon: Gift, tone: 'rose' as const },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="overflow-hidden rounded-4xl border-slate-200 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
          <CardContent className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-violet-50" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-blue-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Platform Admin Dashboard
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                    Cached for 5 minutes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Live snapshot
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">High-signal platform overview in one place.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Track users, institutions, tasks, adventures, points, gifts, and recent activity from a single analytics surface.
                  The dashboard is structured to show health first, then the operational details behind it.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Updated at {formatDateTime(d.generatedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    {formatPercent(d.overview.monthlyGrowthPercent)} monthly growth
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Target className="h-4 w-4 text-violet-600" />
                    {formatPercent(d.tasks.completionRate)} task completion rate
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  onClick={() => void loadDashboard()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh dashboard
                </button>
                <Link
                  href="/tasks"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open tasks
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Total users', value: formatNumber(d.overview.totalUsers), helper: getGrowthLabel(d.overview.newUsersThisMonth, d.overview.newUsersLastMonth), icon: Users, tone: 'blue' as const },
            { label: 'Institutions', value: formatNumber(d.overview.totalInstitutions), helper: `${formatNumber(d.institutions.withActiveAdventures)} active with adventures`, icon: Building2, tone: 'violet' as const },
            { label: 'Children', value: formatNumber(d.overview.totalChildren), helper: `${formatNumber(d.pointsAndLevels.childrenWithZeroPoints)} children with zero points`, icon: UsersRound, tone: 'emerald' as const },
            { label: 'Task completions', value: formatNumber(d.overview.totalTaskCompletions), helper: `${formatPercent(d.tasks.completionRate)} completion rate`, icon: CheckCircle2, tone: 'amber' as const },
            { label: 'Adventure completions', value: formatNumber(d.overview.totalAdventureCompletions), helper: `${formatNumber(d.adventures.totalParticipatingChildren)} participating children`, icon: Trophy, tone: 'rose' as const },
            { label: 'Points awarded', value: formatNumber(d.overview.totalPointsAwarded), helper: `${formatCompact(d.pointsAndLevels.totalPointsSpentOnGifts)} spent on gifts`, icon: Coins, tone: 'cyan' as const },
          ].map((metric) => (
            <DashboardMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 lg:p-7">
                  <DashboardSectionHeader
                    eyebrow="Users"
                    title="User mix and registration velocity"
                    description="See how the platform is split across parents, children, supervisors, and institution admins, plus the registration trend over time."
                    icon={Users}
                  />
                  <div className="space-y-4">
                    {roleBreakdown.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                          <span>{item.label}</span>
                          <span>{formatNumber(item.value)}</span>
                        </div>
                        <DashboardProgressBar value={item.percent} fillClassName={item.fillClassName} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-slate-950 p-6 text-white lg:border-l lg:border-t-0 lg:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Growth pulse</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">New this week</p>
                      <p className="mt-2 text-2xl font-black">{formatNumber(d.users.newThisWeek)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">New this month</p>
                      <p className="mt-2 text-2xl font-black">{formatNumber(d.users.newThisMonth)}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">Registration trend snapshot</p>
                    <div className="mt-4 flex h-40 items-end gap-2">
                      {d.users.registrationTrend.map((point) => {
                        const barHeight = Math.max(Math.round((point.count / registrationMax) * 120), 10);
                        return (
                          <div key={`${point.year}-${point.month}`} className="flex flex-1 flex-col items-center justify-end gap-2">
                            <svg viewBox="0 0 24 140" className="h-36 w-full" role="img" aria-label={`${point.monthLabel} registrations`}>
                              <rect x="2" y={140 - barHeight} width="20" height={barHeight} rx="8" fill="#38bdf8" />
                            </svg>
                            <span className="text-[11px] text-slate-400">{point.monthLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DashboardTrendChart points={d.users.registrationTrend} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Tasks"
                title="Task distribution"
                description="Template mix, assignment status, and the highest-used task templates."
                icon={ClipboardCheck}
              />

              <DashboardDonutChart
                title="Assignments"
                subtitle="Status split"
                centerLabel="total assignments"
                slices={taskStatus}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard
                  label="Completion rate"
                  value={formatPercent(d.tasks.completionRate)}
                  helper={`${formatNumber(d.tasks.pendingReview)} pending review`}
                  icon={Target}
                  tone="emerald"
                />
                <DashboardMetricCard
                  label="Total templates"
                  value={formatNumber(d.tasks.totalTemplates)}
                  helper={`${formatNumber(d.tasks.totalAssignments)} assignments overall`}
                  icon={FileCheck2}
                  tone="violet"
                />
              </div>

              <div className="space-y-3">
                {d.tasks.topTemplates.length > 0 ? d.tasks.topTemplates.map((template, index) => (
                  <DashboardLeaderboardItem
                    key={template.id}
                    rank={index + 1}
                    title={template.titleEn}
                    subtitle={template.type}
                    value={`${formatNumber(template.usageCount)} uses`}
                    icon={Star}
                  />
                )) : (
                  <DashboardEmptyState title="No task templates yet" description="Once templates are created, the most used ones will appear here." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Templates"
                title="Task types"
                description="How templates are distributed by type across the platform."
                icon={ShieldCheck}
              />

              {taskTypes.map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span>{formatNumber(item.value)}</span>
                  </div>
                  <DashboardProgressBar value={item.percent} fillClassName={item.fillClassName} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Coverage"
                title="Institutions and adventures"
                description="Platform coverage, institution efficiency, and adventure participation."
                icon={Building2}
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard label="Total institutions" value={formatNumber(d.institutions.total)} helper={`${formatNumber(d.institutions.withNoChildren)} without children`} icon={Landmark} tone="blue" />
                <DashboardMetricCard label="Active institutions" value={formatNumber(d.institutions.withActiveAdventures)} helper="Institutions with active adventures" icon={Sparkles} tone="emerald" />
                <DashboardMetricCard label="Active adventures" value={formatNumber(d.adventures.activeAdventures)} helper={`${formatNumber(d.adventures.inactiveAdventures)} inactive adventures`} icon={Trophy} tone="violet" />
                <DashboardMetricCard label="Participating children" value={formatNumber(d.adventures.totalParticipatingChildren)} helper={`${formatPercent(d.adventures.completionRate)} adventure completion`} icon={Users} tone="amber" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">Adventure weekly status</p>
                  <div className="mt-4 space-y-3">
                    {Object.entries(d.adventures.weeklyByStatus).map(([status, value], index) => (
                      <div key={status} className="rounded-2xl bg-white p-3 shadow-sm">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                          <span className="capitalize">{status}</span>
                          <span>{formatNumber(value)}</span>
                        </div>
                        <DashboardProgressBar value={(value / weeklyTotal) * 100} fillClassName={fillClassByIndex(index)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">Institution averages</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Children / institution</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{percentFormatter.format(d.institutions.averageChildrenPerInstitution)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Classes / institution</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{percentFormatter.format(d.institutions.averageClassesPerInstitution)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Top institutions by children</p>
                {d.institutions.topByChildren.length > 0 ? d.institutions.topByChildren.map((institution, index) => (
                  <DashboardLeaderboardItem
                    key={institution.id}
                    rank={index + 1}
                    title={institution.name}
                    subtitle={`${formatNumber(institution.childrenCount)} children · ${formatNumber(institution.classesCount)} classes`}
                    value={`${formatNumber(institution.activeAdventuresCount)} active adventures`}
                    icon={Building2}
                  />
                )) : (
                  <DashboardEmptyState title="No institutions to rank yet" description="As institutions start adding children, the top list will appear here." />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Top adventures by participation</p>
                {d.adventures.topByParticipation.length > 0 ? d.adventures.topByParticipation.map((adventure, index) => (
                  <DashboardLeaderboardItem
                    key={adventure.id}
                    rank={index + 1}
                    title={adventure.title}
                    subtitle={`${formatNumber(adventure.participatingChildren)} children · ${formatPercent(adventure.completionRate)} completion`}
                    value={`${percentFormatter.format(adventure.averageStarsEarned)} stars`}
                    icon={Trophy}
                  />
                )) : (
                  <DashboardEmptyState title="No adventures yet" description="Adventure performance will appear here once the platform starts publishing weekly adventures." />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <DashboardDonutChart
              title="Points flow"
              subtitle="Where points are coming from"
              centerLabel="points"
              slices={pointSources}
              formatCompact={formatCompact}
              formatPercent={formatPercent}
            />

            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6 lg:p-7">
                <DashboardSectionHeader
                  eyebrow="Levels"
                  title="Level distribution"
                  description="How children are distributed across platform levels."
                  icon={Award}
                />

                {levelDistribution.length > 0 ? levelDistribution.map((level, index) => (
                  <div key={level.levelId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-500 shadow-sm">{index + 1}</span>
                        {level.levelName}
                      </span>
                      <span>{formatNumber(level.childrenCount)} children</span>
                    </div>
                    <DashboardProgressBar value={level.percentage} fillClassName={level.fillClassName} />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Minimum points: {formatNumber(level.minPoints)}</span>
                      <span>{formatPercent(level.percentage)}</span>
                    </div>
                  </div>
                )) : (
                  <DashboardEmptyState title="No levels found" description="Levels will be listed here as soon as the platform returns distribution data." />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6 lg:p-7">
                <DashboardSectionHeader
                  eyebrow="Children"
                  title="Top children by points"
                  description="Children with the strongest points performance on the platform."
                  icon={Users2}
                />

                {d.pointsAndLevels.topChildren.length > 0 ? d.pointsAndLevels.topChildren.map((child, index) => (
                  <DashboardLeaderboardItem
                    key={child.childId}
                    rank={index + 1}
                    title={child.name}
                    subtitle={`${child.levelName}${child.institutionName ? ` · ${child.institutionName}` : ''}`}
                    value={`${formatNumber(child.highestPoints)} pts`}
                    avatar={child.avatarUrl}
                  />
                )) : (
                  <DashboardEmptyState title="No child rankings yet" description="The ranking appears once children start accumulating points." />
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Activity"
                title="Gifts and recent activity"
                description="Gift inventory, spending, and the last 7 days of platform movement."
                icon={Gift}
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard label="Total gifts" value={formatNumber(d.gifts.totalGifts)} helper={`${formatNumber(d.gifts.activeGifts)} active`} icon={Gift} tone="rose" />
                <DashboardMetricCard label="Purchases" value={formatNumber(d.gifts.totalPurchases)} helper={`${formatCompact(d.gifts.totalPointsSpent)} points spent`} icon={Coins} tone="amber" />
                <DashboardMetricCard label="Active ratio" value={formatPercent(d.gifts.totalGifts ? (d.gifts.activeGifts / d.gifts.totalGifts) * 100 : 0)} helper={`${formatNumber(d.gifts.inactiveGifts)} inactive`} icon={TrendingUp} tone="emerald" />
                <DashboardMetricCard label="Gift catalog" value={formatNumber(d.gifts.totalGifts)} helper="Badge, character, and other" icon={Sparkles} tone="blue" />
              </div>

              <DashboardDonutChart
                title="Gift types"
                subtitle="Inventory split"
                centerLabel="gift items"
                slices={[
                  { label: 'Badge', value: d.gifts.byType.badge, color: '#2563eb', fillClassName: 'bg-blue-600' },
                  { label: 'Character', value: d.gifts.byType.character, color: '#7c3aed', fillClassName: 'bg-violet-500' },
                  { label: 'Other', value: d.gifts.byType.other, color: '#f59e0b', fillClassName: 'bg-amber-500' },
                ]}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />

              <div className="space-y-3">
                {d.gifts.topGifts.length > 0 ? d.gifts.topGifts.map((gift, index) => (
                  <DashboardLeaderboardItem
                    key={gift.id}
                    rank={index + 1}
                    title={gift.name}
                    subtitle={gift.type}
                    value={`${formatNumber(gift.usageCount ?? 0)} uses`}
                    icon={Gift}
                  />
                )) : (
                  <DashboardEmptyState title="No gifts ranked yet" description="Popular gifts will surface here as soon as users start purchasing rewards." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Activity"
                title="Recent activity snapshot"
                description={`What happened in the last ${d.recentActivity.periodDays} days across the platform.`}
                icon={Activity}
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: 'New users', value: d.recentActivity.newUsers, icon: UserPlus, tone: 'blue' as const },
                  { label: 'Tasks completed', value: d.recentActivity.tasksCompleted, icon: ClipboardCheck, tone: 'emerald' as const },
                  { label: 'Adventures completed', value: d.recentActivity.adventuresCompleted, icon: BookOpen, tone: 'violet' as const },
                  { label: 'Level ups', value: d.recentActivity.levelUps, icon: Award, tone: 'amber' as const },
                  { label: 'Gifts purchased', value: d.recentActivity.giftsPurchased, icon: Gift, tone: 'rose' as const },
                  { label: 'Notifications sent', value: d.recentActivity.notificationsSent, icon: Bell, tone: 'cyan' as const },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${toneClassName(item.tone)}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(item.value)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Flame className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Platform rhythm</p>
                    <h3 className="mt-2 text-lg font-bold text-white">Operational signal is concentrated in users and tasks right now.</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      {activityCards.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${toneClassName(item.tone)}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                          <p className="mt-2 text-xl font-black">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm lg:col-span-2">
            <CardContent className="p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Health"
                title="Quick platform health checks"
                description="Short operational cues that help an admin spot imbalance immediately."
                icon={Crown}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Children without points</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(d.pointsAndLevels.childrenWithZeroPoints)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Children without level</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(d.pointsAndLevels.childrenWithNoLevel)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active adventures</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(d.adventures.activeAdventures)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending review</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(d.tasks.pendingReview)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-3 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Signals"
                title="Top signals"
                description="The most important numbers in the current snapshot."
                icon={Crown}
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Monthly growth</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{formatPercent(d.overview.monthlyGrowthPercent)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completion rate</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{formatPercent(d.tasks.completionRate)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Average points / child</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{percentFormatter.format(d.pointsAndLevels.averagePointsPerChild)}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}