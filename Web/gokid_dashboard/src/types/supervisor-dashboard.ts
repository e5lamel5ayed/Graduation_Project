export interface SupervisorDashboardData {
  generatedAt: string;
  supervisorId: string;
  supervisorName: string;
  overview: SupervisorDashboardOverview;
  classes: SupervisorDashboardClasses;
  pendingReviews: SupervisorDashboardPendingReviews;
  childrenProgress: SupervisorDashboardChildrenProgress;
  adventures: SupervisorDashboardAdventures;
  taskPerformance: SupervisorDashboardTaskPerformance;
  recentActivity: SupervisorDashboardRecentActivity;
}

export interface SupervisorDashboardOverview {
  totalClassesSupervised: number;
  totalChildrenSupervised: number;
  tasksAwaitingMyReview: number;
  oldestPendingReviewHours: number;
  activeAdventuresInMyClasses: number;
  tasksCompletedThisWeek: number;
  levelUpsThisWeek: number;
}

export interface SupervisorDashboardClasses {
  totalClasses: number;
  classesWithActiveAdventure: number;
  classesWithPendingReviews: number;
  classBreakdown: SupervisorClassBreakdownItem[];
}

export interface SupervisorClassBreakdownItem {
  classId: string;
  className: string;
  childrenCount: number;
  supervisorCount: number;
  pendingReviewCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  taskCompletionRate: number;
  hasActiveAdventure: boolean;
}

export interface SupervisorDashboardPendingReviews {
  totalPending: number;
  oldestPendingHoursAgo: number;
  byTaskType: SupervisorTaskTypeBreakdown;
  byClass: SupervisorPendingReviewByClassItem[];
  recentlySubmitted: SupervisorRecentlySubmittedItem[];
}

export interface SupervisorTaskTypeBreakdown {
  instantReward: number;
  textQuestion: number;
  voiceQuestion: number;
  evidenceSubmission: number;
}

export interface SupervisorPendingReviewByClassItem {
  classId: string;
  className: string;
  pendingCount: number;
}

export interface SupervisorRecentlySubmittedItem {
  taskId: string;
  title: string;
  childName: string;
  className: string;
  taskType: string;
  submittedAt?: string;
}

export interface SupervisorDashboardChildrenProgress {
  totalChildren: number;
  childrenWithZeroCompletedTasks: number;
  childrenWithZeroPoints: number;
  averageCompletionRate: number;
  averagePointsPerChild: number;
  levelDistribution: SupervisorLevelDistributionItem[];
  topPerformers: SupervisorTopPerformerItem[];
  needsAttention: SupervisorNeedsAttentionItem[];
}

export interface SupervisorLevelDistributionItem {
  levelId: string;
  levelName: string;
  order: number;
  minPoints: number;
  childrenCount: number;
  percentage: number;
}

export interface SupervisorTopPerformerItem {
  childId: string;
  name: string;
  className: string;
  levelName: string;
  points: number;
  completionRate: number;
  avatarUrl?: string | null;
}

export interface SupervisorNeedsAttentionItem {
  childId: string;
  name: string;
  className: string;
  reason: string;
  points: number;
  completionRate: number;
}

export interface SupervisorDashboardAdventures {
  totalWeeklyAssignments: number;
  activeWeeklyAssignments: number;
  completedWeeklyAssignments: number;
  expiredWeeklyAssignments: number;
  totalParticipatingChildren: number;
  overallCompletionRate: number;
  averageStarsEarned: number;
  adventureTasksPendingReview: number;
  currentAdventures: SupervisorCurrentAdventureItem[];
}

export interface SupervisorCurrentAdventureItem {
  weeklyAdventureId: string;
  title: string;
  className: string;
  participatingChildren: number;
  completionRate: number;
  pendingReviewCount: number;
  averageStarsEarned: number;
  isActive: boolean;
}

export interface SupervisorDashboardTaskPerformance {
  totalAssigned: number;
  statusBreakdown: SupervisorTaskStatusBreakdown;
  completionRate: number;
  averageTasksCompletedPerChild: number;
  taskTypeBreakdown: SupervisorTaskTypeBreakdown;
}

export interface SupervisorTaskStatusBreakdown {
  pending: number;
  inProgress: number;
  reviewRequested: number;
  completed: number;
  rejected: number;
}

export interface SupervisorDashboardRecentActivity {
  periodDays: number;
  tasksCompleted: number;
  tasksReviewedInMyClasses: number;
  tasksRejected: number;
  adventureProgressCompleted: number;
  levelUpsInMyClasses: number;
  newChildrenInMyClasses: number;
}