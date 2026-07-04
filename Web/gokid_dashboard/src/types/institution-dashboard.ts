export interface InstitutionDashboardData {
  generatedAt: string;
  institutionId: string;
  institutionName: string;
  institutionCreatedAt: string;
  overview: InstitutionDashboardOverview;
  classes: InstitutionDashboardClasses;
  supervisors: InstitutionDashboardSupervisors;
  children: InstitutionDashboardChildren;
  adventures: InstitutionDashboardAdventures;
  tasks: InstitutionDashboardTasks;
  pointsAndLevels: InstitutionDashboardPointsAndLevels;
  recentActivity: InstitutionDashboardRecentActivity;
}

export interface InstitutionDashboardOverview {
  totalClasses: number;
  totalChildren: number;
  totalSupervisors: number;
  childrenInClasses: number;
  childrenWithNoClass: number;
  activeWeeklyAdventures: number;
  tasksAwaitingReview: number;
}

export interface InstitutionDashboardClasses {
  totalClasses: number;
  classesWithSupervisor: number;
  classesWithNoSupervisor: number;
  classesWithActiveAdventure: number;
  averageChildrenPerClass: number;
  classBreakdown: InstitutionClassBreakdownItem[];
}

export interface InstitutionClassBreakdownItem {
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

export interface InstitutionDashboardSupervisors {
  totalSupervisors: number;
  supervisorsWithClasses: number;
  supervisorsWithNoClass: number;
  totalPendingReviews: number;
  supervisorBreakdown: InstitutionSupervisorBreakdownItem[];
}

export interface InstitutionSupervisorBreakdownItem {
  supervisorId: string;
  name: string;
  assignedClassesCount: number;
  supervisedChildrenCount: number;
  pendingReviewCount: number;
}

export interface InstitutionDashboardChildren {
  totalEnrolled: number;
  enrolledInClass: number;
  notInAnyClass: number;
  withZeroCompletedTasks: number;
  withZeroPoints: number;
  withNoLevel: number;
  averagePointsPerChild: number;
  levelDistribution: InstitutionLevelDistributionItem[];
  topChildren: InstitutionTopChildItem[];
}

export interface InstitutionLevelDistributionItem {
  levelId: string;
  levelName: string;
  order: number;
  minPoints: number;
  childrenCount: number;
  percentage: number;
}

export interface InstitutionTopChildItem {
  childId: string;
  name: string;
  levelName: string;
  institutionName?: string | null;
  highestPoints: number;
  avatarUrl?: string | null;
}

export interface InstitutionDashboardAdventures {
  totalAdventures: number;
  activeAdventures: number;
  inactiveAdventures: number;
  totalWeeklyAssignments: number;
  activeWeeklyAssignments: number;
  totalParticipatingChildren: number;
  overallCompletionRate: number;
  averageStarsEarned: number;
  adventureBreakdown: Array<Record<string, unknown>>;
}

export interface InstitutionDashboardTasks {
  totalAssigned: number;
  statusBreakdown: {
    pending: number;
    inProgress: number;
    reviewRequested: number;
    completed: number;
    rejected: number;
  };
  overallCompletionRate: number;
  averageTasksCompletedPerChild: number;
  oldestPendingReviewAgeHours: number;
}

export interface InstitutionDashboardPointsAndLevels {
  totalPointsEarned: number;
  totalPointsSpentOnGifts: number;
  averagePointsPerChild: number;
  childrenWithZeroPoints: number;
  childrenWithNoLevel: number;
  levelDistribution: InstitutionLevelDistributionItem[];
}

export interface InstitutionDashboardRecentActivity {
  periodDays: number;
  newChildrenEnrolled: number;
  tasksCompleted: number;
  adventureProgressCompleted: number;
  levelUps: number;
  giftsPurchased: number;
  tasksReviewed: number;
}