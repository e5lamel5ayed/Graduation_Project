'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  Coins,
  FileCheck2,
  GraduationCap,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Users2,
  UserRound,
  BookOpen,
  BadgeInfo,
  ClipboardCheck,
  UsersRound,
  School2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/Card';
import {
  DashboardDonutChart,
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLeaderboardItem,
  DashboardLoadingState,
  DashboardMetricCard,
  DashboardProgressBar,
  DashboardSectionHeader,
} from '@/src/components/dashboard';
import { institutionDashboardService } from '@/src/services/institutionDashboardService';
import type { InstitutionDashboardData } from '@/src/types/institution-dashboard';

const numberFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const percentFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const palette = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#14b8a6'];
const fillClasses = ['bg-blue-600', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-teal-500'];

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

function fillClassByIndex(index: number) {
  return fillClasses[index % fillClasses.length];
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

export function InstitutionDashboardView() {
  const [dashboard, setDashboard] = useState<InstitutionDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await institutionDashboardService.getDashboard();
      setDashboard(response);
    } catch (loadError) {
      console.error('Failed to load institution dashboard:', loadError);
      setError('Failed to load institution dashboard.');
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
    return <DashboardErrorState message={error ?? 'No institution dashboard data returned from the server.'} onRetry={() => void loadDashboard()} />;
  }

  const d = dashboard;

  const classStatusSlices = [
    { label: 'With supervisor', value: d.classes.classesWithSupervisor, color: palette[0], fillClassName: fillClasses[0] },
    { label: 'Without supervisor', value: d.classes.classesWithNoSupervisor, color: palette[1], fillClassName: fillClasses[1] },
    { label: 'Active adventures', value: d.classes.classesWithActiveAdventure, color: palette[2], fillClassName: fillClasses[2] },
  ];

  const taskStatusSlices = [
    { label: 'Pending', value: d.tasks.statusBreakdown.pending, color: palette[3], fillClassName: fillClasses[3] },
    { label: 'In progress', value: d.tasks.statusBreakdown.inProgress, color: palette[5], fillClassName: fillClasses[5] },
    { label: 'Review requested', value: d.tasks.statusBreakdown.reviewRequested, color: palette[6], fillClassName: fillClasses[6] },
    { label: 'Completed', value: d.tasks.statusBreakdown.completed, color: palette[2], fillClassName: fillClasses[2] },
    { label: 'Rejected', value: d.tasks.statusBreakdown.rejected, color: palette[4], fillClassName: fillClasses[4] },
  ];

  const recentActivityCards = [
    { label: 'Children enrolled', value: d.recentActivity.newChildrenEnrolled, icon: Users, tone: 'blue' as const },
    { label: 'Tasks completed', value: d.recentActivity.tasksCompleted, icon: ClipboardCheck, tone: 'emerald' as const },
    { label: 'Adventure progress', value: d.recentActivity.adventureProgressCompleted, icon: Trophy, tone: 'violet' as const },
    { label: 'Level ups', value: d.recentActivity.levelUps, icon: Award, tone: 'amber' as const },
    { label: 'Gifts purchased', value: d.recentActivity.giftsPurchased, icon: Sparkles, tone: 'rose' as const },
    { label: 'Tasks reviewed', value: d.recentActivity.tasksReviewed, icon: CheckCircle2, tone: 'cyan' as const },
  ];
  

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="overflow-hidden rounded-4xl border-slate-200 bg-white/85 shadow-xl shadow-slate-200/70 backdrop-blur">
          <CardContent className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-white to-blue-50" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-lg shadow-violet-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Institution Admin Dashboard
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <Clock3 className="h-3.5 w-3.5 text-violet-600" />
                    Cached for 5 minutes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Institution scoped snapshot
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Everything the institution admin needs in one view.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Monitor classes, supervisors, children, adventures, tasks, and points from a single operational dashboard.
                  This view is built around the institution you are authenticated to manage.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Activity className="h-4 w-4 text-violet-600" />
                    Updated at {formatDateTime(d.generatedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    {d.institutionName}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    Created {formatDateTime(d.institutionCreatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  onClick={() => void loadDashboard()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh dashboard
                </button>
                <Link
                  href="/classes"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open classes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Classes', value: formatNumber(d.overview.totalClasses), helper: `${formatNumber(d.classes.classesWithSupervisor)} with supervisor`, icon: School2, tone: 'blue' as const },
            { label: 'Children', value: formatNumber(d.overview.totalChildren), helper: `${formatNumber(d.children.enrolledInClass)} enrolled in classes`, icon: UsersRound, tone: 'emerald' as const },
            { label: 'Supervisors', value: formatNumber(d.overview.totalSupervisors), helper: `${formatNumber(d.supervisors.supervisorsWithClasses)} assigned to classes`, icon: UserRound, tone: 'violet' as const },
            { label: 'Tasks awaiting review', value: formatNumber(d.overview.tasksAwaitingReview), helper: `${formatPercent(d.tasks.overallCompletionRate)} completion rate`, icon: AlertTriangle, tone: 'amber' as const },
            { label: 'Active weekly adventures', value: formatNumber(d.overview.activeWeeklyAdventures), helper: `${formatNumber(d.adventures.totalWeeklyAssignments)} weekly assignments`, icon: BookOpen, tone: 'rose' as const },
            { label: 'Children without class', value: formatNumber(d.overview.childrenWithNoClass), helper: `${formatNumber(d.children.notInAnyClass)} total outside classes`, icon: Layers3, tone: 'cyan' as const },
            { label: 'Average points / child', value: formatNumber(d.pointsAndLevels.averagePointsPerChild), helper: `${formatCompact(d.pointsAndLevels.totalPointsEarned)} total earned`, icon: Coins, tone: 'violet' as const },
            { label: 'Children with no level', value: formatNumber(d.pointsAndLevels.childrenWithNoLevel), helper: `${formatNumber(d.pointsAndLevels.childrenWithZeroPoints)} with zero points`, icon: BadgeInfo, tone: 'blue' as const },
          ].map((metric) => (
            <DashboardMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Classes"
                title="Class coverage and task health"
                description="Understand how classes are distributed across supervisors, activity, and completion state."
                icon={School2}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="With supervisor" value={formatNumber(d.classes.classesWithSupervisor)} helper={`${formatPercent(d.classes.totalClasses ? (d.classes.classesWithSupervisor / d.classes.totalClasses) * 100 : 0)} of classes`} icon={ShieldCheck} tone="emerald" />
                <DashboardMetricCard label="Without supervisor" value={formatNumber(d.classes.classesWithNoSupervisor)} helper="Needs assignment" icon={UserRound} tone="rose" />
                <DashboardMetricCard label="With active adventure" value={formatNumber(d.classes.classesWithActiveAdventure)} helper="Classes currently engaged" icon={Sparkles} tone="violet" />
                <DashboardMetricCard label="Avg children / class" value={formatNumber(d.classes.averageChildrenPerClass)} helper={`${formatNumber(d.classes.totalClasses)} total classes`} icon={Users} tone="blue" />
              </div>

              <DashboardDonutChart
                title="Class coverage"
                subtitle="Supervisor and adventure distribution"
                centerLabel="classes"
                slices={classStatusSlices}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Class breakdown</p>
                {d.classes.classBreakdown.length > 0 ? d.classes.classBreakdown.map((item, index) => (
                  <div key={item.classId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.className}</p>
                        <p className="text-xs text-slate-500">{formatNumber(item.childrenCount)} children · {formatNumber(item.supervisorCount)} supervisors</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{formatPercent(item.taskCompletionRate)}</span>
                    </div>
                    <DashboardProgressBar value={item.taskCompletionRate} fillClassName={fillClassByIndex(index)} />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatNumber(item.completedTasksCount)} completed tasks</span>
                      <span>{formatNumber(item.pendingReviewCount)} pending review</span>
                    </div>
                  </div>
                )) : (
                  <DashboardEmptyState title="No classes yet" description="Class performance cards will appear here as soon as the institution starts creating classes." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Supervisors"
                title="Supervisor assignment overview"
                description="Spot supervisors without classes and the ones carrying the most children."
                icon={UserRound}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="With classes" value={formatNumber(d.supervisors.supervisorsWithClasses)} helper={`${formatPercent(d.supervisors.totalSupervisors ? (d.supervisors.supervisorsWithClasses / d.supervisors.totalSupervisors) * 100 : 0)} of supervisors`} icon={Users2} tone="emerald" />
                <DashboardMetricCard label="Without classes" value={formatNumber(d.supervisors.supervisorsWithNoClass)} helper="Need assignment" icon={UserRound} tone="amber" />
                <DashboardMetricCard label="Pending reviews" value={formatNumber(d.supervisors.totalPendingReviews)} helper="Across all supervisors" icon={ClipboardCheck} tone="rose" />
                <DashboardMetricCard label="Total supervisors" value={formatNumber(d.supervisors.totalSupervisors)} helper={`${formatNumber(d.overview.totalSupervisors)} in overview`} icon={Building2} tone="blue" />
              </div>

              <div className="space-y-3">
                {d.supervisors.supervisorBreakdown.length > 0 ? d.supervisors.supervisorBreakdown.map((item, index) => (
                  <DashboardLeaderboardItem
                    key={item.supervisorId}
                    rank={index + 1}
                    title={item.name}
                    subtitle={`${formatNumber(item.assignedClassesCount)} classes · ${formatNumber(item.supervisedChildrenCount)} children`}
                    value={`${formatNumber(item.pendingReviewCount)} pending`}
                    icon={UserRound}
                  />
                )) : (
                  <DashboardEmptyState title="No supervisor breakdown yet" description="Supervisor ranking cards will appear here when data is available." />
                )}
              </div>

              <DashboardDonutChart
                title="Tasks awaiting review"
                subtitle="Status split"
                centerLabel="tasks"
                slices={taskStatusSlices}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Children"
                title="Enrollment and level distribution"
                description="How children are spread across classes and levels inside the institution."
                icon={GraduationCap}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Total enrolled" value={formatNumber(d.children.totalEnrolled)} helper={`${formatNumber(d.children.enrolledInClass)} in classes`} icon={Users} tone="blue" />
                <DashboardMetricCard label="Not in any class" value={formatNumber(d.children.notInAnyClass)} helper="Needs assignment" icon={Layers3} tone="amber" />
                <DashboardMetricCard label="Zero completed tasks" value={formatNumber(d.children.withZeroCompletedTasks)} helper="Children who need momentum" icon={FileCheck2} tone="violet" />
                <DashboardMetricCard label="Average points / child" value={formatNumber(d.children.averagePointsPerChild)} helper={`${formatPercent(d.children.totalEnrolled ? (d.children.enrolledInClass / d.children.totalEnrolled) * 100 : 0)} enrolled in class`} icon={Coins} tone="emerald" />
              </div>

              <div className="space-y-3">
                {d.children.levelDistribution.length > 0 ? d.children.levelDistribution
                  .slice()
                  .sort((left, right) => left.order - right.order)
                  .map((level, index) => (
                    <div key={level.levelId} className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-500 shadow-sm">{index + 1}</span>
                          {level.levelName}
                        </span>
                        <span>{formatNumber(level.childrenCount)} children</span>
                      </div>
                      <DashboardProgressBar value={level.percentage} fillClassName={fillClassByIndex(index)} />
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Minimum points: {formatNumber(level.minPoints)}</span>
                        <span>{formatPercent(level.percentage)}</span>
                      </div>
                    </div>
                  )) : (
                  <DashboardEmptyState title="No level distribution yet" description="Level distribution will appear as soon as children start earning points." />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Top children by points</p>
                {d.children.topChildren.length > 0 ? d.children.topChildren.map((child, index) => (
                  <DashboardLeaderboardItem
                    key={child.childId}
                    rank={index + 1}
                    title={child.name}
                    subtitle={`${child.levelName}${child.institutionName ? ` · ${child.institutionName}` : ''}`}
                    value={`${formatNumber(child.highestPoints)} pts`}
                    avatar={child.avatarUrl}
                  />
                )) : (
                  <DashboardEmptyState title="No child rankings yet" description="Children rankings will appear here once points are available." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Recent activity"
                title="Operational movement"
                description={`Activity across the last ${d.recentActivity.periodDays} days inside this institution.`}
                icon={Activity}
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {recentActivityCards.map((item) => (
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
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Institution pulse</p>
                    <h3 className="mt-2 text-lg font-bold text-white">Classes and supervisors need the first review, then the children pipeline.</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      The dashboard is intentionally centered on assignment coverage, pending reviews, and children placement so the admin can act quickly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Tasks"
                title="Task performance in the institution"
                description="Assignment completion and review pressure across the institution."
                icon={FileCheck2}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Total assigned" value={formatNumber(d.tasks.totalAssigned)} helper={`${formatPercent(d.tasks.overallCompletionRate)} completion`} icon={FileCheck2} tone="blue" />
                <DashboardMetricCard label="Avg completed / child" value={formatNumber(d.tasks.averageTasksCompletedPerChild)} helper={`${formatNumber(d.overview.totalChildren)} children tracked`} icon={Target} tone="emerald" />
                <DashboardMetricCard label="Oldest review age" value={formatNumber(d.tasks.oldestPendingReviewAgeHours)} helper="Hours since oldest pending review" icon={Clock3} tone="amber" />
                <DashboardMetricCard label="Awaiting review" value={formatNumber(d.overview.tasksAwaitingReview)} helper={`${formatNumber(d.supervisors.totalPendingReviews)} supervisor pending`} icon={AlertTriangle} tone="rose" />
              </div>

              <DashboardDonutChart
                title="Task statuses"
                subtitle="Assignment state split"
                centerLabel="tasks"
                slices={taskStatusSlices}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Task coverage against class totals</span>
                  <span>{formatPercent(d.tasks.overallCompletionRate)}</span>
                </div>
                <DashboardProgressBar value={d.tasks.overallCompletionRate} fillClassName="bg-violet-500" />
                <p className="mt-2 text-xs text-slate-500">Class task completion is aggregated across all classes in the institution.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Points & Levels"
                title="Point economy and distribution"
                description="How points are earned and how children are distributed across the level ladder."
                icon={Award}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Points earned" value={formatNumber(d.pointsAndLevels.totalPointsEarned)} helper={`${formatCompact(d.pointsAndLevels.totalPointsSpentOnGifts)} spent on gifts`} icon={Coins} tone="emerald" />
                <DashboardMetricCard label="Zero points" value={formatNumber(d.pointsAndLevels.childrenWithZeroPoints)} helper={`${formatNumber(d.pointsAndLevels.childrenWithNoLevel)} with no level`} icon={BadgeInfo} tone="amber" />
                <DashboardMetricCard label="Average points / child" value={formatNumber(d.pointsAndLevels.averagePointsPerChild)} helper="Points per enrolled child" icon={Target} tone="violet" />
                <DashboardMetricCard label="Levels tracked" value={formatNumber(d.pointsAndLevels.levelDistribution.length)} helper="Progress ladder configured" icon={Layers3} tone="blue" />
              </div>

              <div className="space-y-3">
                {d.pointsAndLevels.levelDistribution.length > 0 ? d.pointsAndLevels.levelDistribution
                  .slice()
                  .sort((left, right) => left.order - right.order)
                  .map((level, index) => (
                    <div key={level.levelId} className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                        <span>{level.levelName}</span>
                        <span>{formatNumber(level.childrenCount)} children</span>
                      </div>
                      <DashboardProgressBar value={level.percentage} fillClassName={fillClassByIndex(index)} />
                    </div>
                  )) : (
                  <DashboardEmptyState title="No points distribution yet" description="Level distribution will appear here once children start earning points." />
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}