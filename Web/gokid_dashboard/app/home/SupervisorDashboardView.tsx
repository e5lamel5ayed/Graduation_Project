'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Award,
  BadgeInfo,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  Coins,
  FileCheck2,
  Flame,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  School,
  Users,
  Users2,
  UsersRound,
  ClipboardCheck,
  AlertTriangle,
  Brain,
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
import { supervisorDashboardService } from '@/src/services/supervisorDashboardService';
import type { SupervisorDashboardData } from '@/src/types/supervisor-dashboard';

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

export function SupervisorDashboardView() {
  const [dashboard, setDashboard] = useState<SupervisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supervisorDashboardService.getDashboard();
      setDashboard(response);
    } catch (loadError) {
      console.error('Failed to load supervisor dashboard:', loadError);
      setError('Failed to load supervisor dashboard.');
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
    return <DashboardErrorState message={error ?? 'No supervisor dashboard data returned from the server.'} onRetry={() => void loadDashboard()} />;
  }

  const d = dashboard;
  const pendingReviewTotal = d.pendingReviews.totalPending || 1;
  const levelDistribution = [...d.childrenProgress.levelDistribution].sort((left, right) => left.order - right.order).map((level, index) => ({ ...level, fillClassName: fillClassByIndex(index) }));
  const classBreakdown = d.classes.classBreakdown;
  const recentActivityCards = [
    { label: 'Tasks completed', value: d.recentActivity.tasksCompleted, icon: ClipboardCheck, tone: 'emerald' as const },
    { label: 'Reviewed in my classes', value: d.recentActivity.tasksReviewedInMyClasses, icon: CheckCircle2, tone: 'blue' as const },
    { label: 'Tasks rejected', value: d.recentActivity.tasksRejected, icon: AlertTriangle, tone: 'rose' as const },
    { label: 'Level ups', value: d.recentActivity.levelUpsInMyClasses, icon: Award, tone: 'violet' as const },
    { label: 'Children added', value: d.recentActivity.newChildrenInMyClasses, icon: Users, tone: 'amber' as const },
    { label: 'Adventure progress', value: d.recentActivity.adventureProgressCompleted, icon: Sparkles, tone: 'cyan' as const },
  ];

  const pendingReviewSlices = [
    { label: 'Instant reward', value: d.pendingReviews.byTaskType.instantReward, color: palette[0], fillClassName: fillClasses[0] },
    { label: 'Text question', value: d.pendingReviews.byTaskType.textQuestion, color: palette[1], fillClassName: fillClasses[1] },
    { label: 'Voice question', value: d.pendingReviews.byTaskType.voiceQuestion, color: palette[2], fillClassName: fillClasses[2] },
    { label: 'Evidence submission', value: d.pendingReviews.byTaskType.evidenceSubmission, color: palette[3], fillClassName: fillClasses[3] },
  ];

  const taskPerformanceSlices = [
    { label: 'Pending', value: d.taskPerformance.statusBreakdown.pending, color: palette[3], fillClassName: fillClasses[3] },
    { label: 'In progress', value: d.taskPerformance.statusBreakdown.inProgress, color: palette[5], fillClassName: fillClasses[5] },
    { label: 'Review requested', value: d.taskPerformance.statusBreakdown.reviewRequested, color: palette[6], fillClassName: fillClasses[6] },
    { label: 'Completed', value: d.taskPerformance.statusBreakdown.completed, color: palette[2], fillClassName: fillClasses[2] },
    { label: 'Rejected', value: d.taskPerformance.statusBreakdown.rejected, color: palette[4], fillClassName: fillClasses[4] },
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
                    Supervisor Dashboard
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <Clock3 className="h-3.5 w-3.5 text-blue-600" />
                    Cached for 3 minutes
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Supervisor scoped snapshot
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Your class review and child progress cockpit.</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Track classes, pending reviews, children progress, adventures, task performance, and weekly movement from the supervisor scope only.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Updated at {formatDateTime(d.generatedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Users2 className="h-4 w-4 text-violet-600" />
                    {d.supervisorName}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-sm">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    Review cache 3 minutes
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
                  href="/adventures"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open adventures
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Classes supervised', value: formatNumber(d.overview.totalClassesSupervised), helper: `${d.classes.classesWithActiveAdventure} with active adventure`, icon: School, tone: 'blue' as const },
            { label: 'Children supervised', value: formatNumber(d.overview.totalChildrenSupervised), helper: `${d.childrenProgress.childrenWithZeroCompletedTasks} with zero completed tasks`, icon: UsersRound, tone: 'emerald' as const },
            { label: 'Tasks awaiting my review', value: formatNumber(d.overview.tasksAwaitingMyReview), helper: `${formatNumber(d.overview.oldestPendingReviewHours)} hours oldest`, icon: ClipboardCheck, tone: 'amber' as const },
            { label: 'Active adventures', value: formatNumber(d.overview.activeAdventuresInMyClasses), helper: `${d.adventures.activeWeeklyAssignments} active assignments`, icon: BookOpen, tone: 'violet' as const },
            { label: 'Tasks completed this week', value: formatNumber(d.overview.tasksCompletedThisWeek), helper: `${d.recentActivity.tasksReviewedInMyClasses} reviewed in my classes`, icon: CheckCircle2, tone: 'rose' as const },
            { label: 'Level ups this week', value: formatNumber(d.overview.levelUpsThisWeek), helper: `${formatPercent(d.taskPerformance.completionRate)} completion rate`, icon: Award, tone: 'cyan' as const },
          ].map((metric) => (
            <DashboardMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-6 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Classes"
                title="Class coverage and review load"
                description="Which classes are active, and how review pressure is distributed."
                icon={School}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Total classes" value={formatNumber(d.classes.totalClasses)} helper={`${formatNumber(d.classes.classesWithActiveAdventure)} with active adventures`} icon={Building2} tone="blue" />
                <DashboardMetricCard label="With active adventure" value={formatNumber(d.classes.classesWithActiveAdventure)} helper={`${formatPercent(d.classes.totalClasses ? (d.classes.classesWithActiveAdventure / d.classes.totalClasses) * 100 : 0)} coverage`} icon={Sparkles} tone="emerald" />
                <DashboardMetricCard label="With pending reviews" value={formatNumber(d.classes.classesWithPendingReviews)} helper={`${formatPercent(d.classes.totalClasses ? (d.classes.classesWithPendingReviews / d.classes.totalClasses) * 100 : 0)} of classes`} icon={ClipboardCheck} tone="amber" />
                <DashboardMetricCard label="Children supervised" value={formatNumber(d.overview.totalChildrenSupervised)} helper={`${formatPercent(d.overview.totalClassesSupervised ? (d.overview.totalChildrenSupervised / d.overview.totalClassesSupervised) : 0)} avg / class`} icon={Users} tone="violet" />
              </div>

              <div className="space-y-3">
                {classBreakdown.length > 0 ? classBreakdown.map((item, index) => (
                  <div key={item.classId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span>{item.className}</span>
                      <span>{formatPercent(item.taskCompletionRate)}</span>
                    </div>
                    <DashboardProgressBar value={item.taskCompletionRate} fillClassName={fillClassByIndex(index)} />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatNumber(item.childrenCount)} children</span>
                      <span>{formatNumber(item.pendingReviewCount)} pending reviews</span>
                    </div>
                  </div>
                )) : (
                  <DashboardEmptyState title="No classes assigned" description="Class performance will appear here once the supervisor has assigned classes." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Pending reviews"
                title="Review queue by task type"
                description="How much work is waiting on you right now, split by task type and class."
                icon={ClipboardCheck}
              />

              <DashboardDonutChart
                title="Review queue"
                subtitle="By task type"
                centerLabel="pending"
                slices={pendingReviewSlices}
                formatCompact={formatCompact}
                formatPercent={formatPercent}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Oldest review" value={formatNumber(d.pendingReviews.oldestPendingHoursAgo)} helper="Hours ago" icon={Clock3} tone="rose" />
                <DashboardMetricCard label="Total pending" value={formatNumber(d.pendingReviews.totalPending)} helper={`${formatNumber(d.overview.tasksAwaitingMyReview)} awaiting my review`} icon={AlertTriangle} tone="amber" />
              </div>

              <div className="space-y-3">
                {d.pendingReviews.byClass.length > 0 ? d.pendingReviews.byClass.map((item, index) => (
                  <div key={item.classId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span>{item.className}</span>
                      <span>{formatNumber(item.pendingCount)}</span>
                    </div>
                    <DashboardProgressBar value={(item.pendingCount / pendingReviewTotal) * 100} fillClassName={fillClassByIndex(index)} />
                  </div>
                )) : (
                  <DashboardEmptyState title="No pending reviews" description="The review queue is empty right now." />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Recently submitted</p>
                {d.pendingReviews.recentlySubmitted.length > 0 ? d.pendingReviews.recentlySubmitted.map((item) => (
                  <DashboardLeaderboardItem
                    key={item.taskId}
                    rank={1}
                    title={item.title}
                    subtitle={`${item.childName} · ${item.className} · ${item.taskType}`}
                    value={item.submittedAt ? formatDateTime(item.submittedAt) : 'Just now'}
                    icon={FileCheck2}
                  />
                )) : (
                  <DashboardEmptyState title="No recent submissions" description="Recent submitted tasks will appear here." />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Children progress"
                title="Progress, levels, and attention flags"
                description="See who is performing well and who needs intervention across your classes."
                icon={Target}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Total children" value={formatNumber(d.childrenProgress.totalChildren)} helper={`${formatPercent(d.childrenProgress.averageCompletionRate)} average completion`} icon={Users} tone="blue" />
                <DashboardMetricCard label="Zero completed tasks" value={formatNumber(d.childrenProgress.childrenWithZeroCompletedTasks)} helper="Need a first win" icon={FileCheck2} tone="amber" />
                <DashboardMetricCard label="Zero points" value={formatNumber(d.childrenProgress.childrenWithZeroPoints)} helper="Need reward momentum" icon={Coins} tone="rose" />
                <DashboardMetricCard label="Average points / child" value={formatNumber(d.childrenProgress.averagePointsPerChild)} helper={`${formatPercent(d.childrenProgress.averageCompletionRate)} completion`} icon={BadgeInfo} tone="emerald" />
              </div>

              <div className="space-y-3">
                {levelDistribution.length > 0 ? levelDistribution.map((level, index) => (
                  <div key={level.levelId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span>{level.levelName}</span>
                      <span>{formatNumber(level.childrenCount)} children</span>
                    </div>
                    <DashboardProgressBar value={level.percentage} fillClassName={fillClassByIndex(index)} />
                  </div>
                )) : (
                  <DashboardEmptyState title="No level distribution yet" description="Children level distribution will appear here once points exist." />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Top performers</p>
                {d.childrenProgress.topPerformers.length > 0 ? d.childrenProgress.topPerformers.map((child, index) => (
                  <DashboardLeaderboardItem
                    key={child.childId}
                    rank={index + 1}
                    title={child.name}
                    subtitle={`${child.className} · ${child.levelName} · ${formatPercent(child.completionRate)} completion`}
                    value={`${formatNumber(child.points)} pts`}
                    avatar={child.avatarUrl}
                  />
                )) : (
                  <DashboardEmptyState title="No top performers yet" description="High performers will appear here as progress data grows." />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900">Needs attention</p>
                {d.childrenProgress.needsAttention.length > 0 ? d.childrenProgress.needsAttention.map((child) => (
                  <DashboardLeaderboardItem
                    key={child.childId}
                    rank={1}
                    title={child.name}
                    subtitle={`${child.className} · ${child.reason}`}
                    value={`${formatPercent(child.completionRate)} completion`}
                    icon={AlertTriangle}
                  />
                )) : (
                  <DashboardEmptyState title="No urgent flags" description="Children needing attention will appear here." />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <DashboardDonutChart
              title="Task performance"
              subtitle="Overall status split"
              centerLabel="tasks"
              slices={taskPerformanceSlices}
              formatCompact={formatCompact}
              formatPercent={formatPercent}
            />

            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6 lg:p-7">
                <DashboardSectionHeader
                  eyebrow="Task performance"
                  title="Type mix and completion rate"
                  description="Track what kind of tasks dominate your classes and how fast they are completed."
                  icon={FileCheck2}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <DashboardMetricCard label="Total assigned" value={formatNumber(d.taskPerformance.totalAssigned)} helper={`${formatPercent(d.taskPerformance.completionRate)} completion`} icon={FileCheck2} tone="blue" />
                  <DashboardMetricCard label="Avg completed / child" value={formatNumber(d.taskPerformance.averageTasksCompletedPerChild)} helper="Cross-class average" icon={Target} tone="emerald" />
                </div>

                {[
                  { label: 'Instant reward', value: d.taskPerformance.taskTypeBreakdown.instantReward, percent: d.taskPerformance.totalAssigned ? (d.taskPerformance.taskTypeBreakdown.instantReward / d.taskPerformance.totalAssigned) * 100 : 0, fillClassName: fillClasses[0] },
                  { label: 'Text question', value: d.taskPerformance.taskTypeBreakdown.textQuestion, percent: d.taskPerformance.totalAssigned ? (d.taskPerformance.taskTypeBreakdown.textQuestion / d.taskPerformance.totalAssigned) * 100 : 0, fillClassName: fillClasses[1] },
                  { label: 'Voice question', value: d.taskPerformance.taskTypeBreakdown.voiceQuestion, percent: d.taskPerformance.totalAssigned ? (d.taskPerformance.taskTypeBreakdown.voiceQuestion / d.taskPerformance.totalAssigned) * 100 : 0, fillClassName: fillClasses[2] },
                  { label: 'Evidence submission', value: d.taskPerformance.taskTypeBreakdown.evidenceSubmission, percent: d.taskPerformance.totalAssigned ? (d.taskPerformance.taskTypeBreakdown.evidenceSubmission / d.taskPerformance.totalAssigned) * 100 : 0, fillClassName: fillClasses[3] },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span>{formatNumber(item.value)}</span>
                    </div>
                    <DashboardProgressBar value={item.percent} fillClassName={item.fillClassName} />
                  </div>
                ))}

                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Flame className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Review pressure</p>
                      <h3 className="mt-2 text-lg font-bold text-white">{formatNumber(d.pendingReviews.totalPending)} tasks are waiting in your queue.</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        The oldest pending review is {formatNumber(d.pendingReviews.oldestPendingHoursAgo)} hours old, so this is the main place to focus.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Adventures"
                title="Weekly adventure activity"
                description="Which adventures are active, how much participation they have, and how many are still pending review."
                icon={BookOpen}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardMetricCard label="Weekly assignments" value={formatNumber(d.adventures.totalWeeklyAssignments)} helper={`${formatNumber(d.adventures.activeWeeklyAssignments)} active`} icon={BookOpen} tone="blue" />
                <DashboardMetricCard label="Completed weekly" value={formatNumber(d.adventures.completedWeeklyAssignments)} helper={`${formatNumber(d.adventures.expiredWeeklyAssignments)} expired`} icon={CheckCircle2} tone="emerald" />
                <DashboardMetricCard label="Participants" value={formatNumber(d.adventures.totalParticipatingChildren)} helper={`${formatPercent(d.adventures.overallCompletionRate)} overall completion`} icon={Users} tone="violet" />
                <DashboardMetricCard label="Pending review" value={formatNumber(d.adventures.adventureTasksPendingReview)} helper={`${formatNumber(d.adventures.averageStarsEarned)} average stars`} icon={Clock3} tone="amber" />
              </div>

              <div className="space-y-3">
                {d.adventures.currentAdventures.length > 0 ? d.adventures.currentAdventures.map((adventure, index) => (
                  <div key={adventure.weeklyAdventureId} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                      <span>{adventure.title}</span>
                      <span>{formatPercent(adventure.completionRate)}</span>
                    </div>
                    <DashboardProgressBar value={adventure.completionRate} fillClassName={fillClassByIndex(index)} />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{adventure.className}</span>
                      <span>{formatNumber(adventure.pendingReviewCount)} pending reviews</span>
                    </div>
                  </div>
                )) : (
                  <DashboardEmptyState title="No active adventures" description="Adventure cards will appear here when weekly adventures are assigned to your classes." />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-5 p-6 lg:p-7">
              <DashboardSectionHeader
                eyebrow="Recent activity"
                title="Weekly movement in my classes"
                description={`What changed over the last ${d.recentActivity.periodDays} days in the supervisor scope.`}
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
                    <Brain className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Supervisor pulse</p>
                    <h3 className="mt-2 text-lg font-bold text-white">The highest pressure right now is the review queue.</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Focus on pending reviews, then use the class coverage section to rebalance anything that is inactive or without oversight.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}