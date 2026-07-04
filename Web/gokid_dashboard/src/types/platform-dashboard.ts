export interface ApiResponse<T> {
  statusCode: string;
  succeeded: boolean;
  message?: string | null;
  errors?: string[] | null;
  data: T;
}

export interface DashboardOverview {
  totalUsers: number;
  totalInstitutions: number;
  totalChildren: number;
  totalTaskCompletions: number;
  totalAdventureCompletions: number;
  totalPointsAwarded: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  monthlyGrowthPercent: number;
}

export interface DashboardTrendPoint {
  year: number;
  month: number;
  monthLabel: string;
  count: number;
}

export interface DashboardUserStats {
  totalParents: number;
  totalChildren: number;
  totalSupervisors: number;
  totalInstitutionAdmins: number;
  newThisWeek: number;
  newThisMonth: number;
  registrationTrend: DashboardTrendPoint[];
}

export interface DashboardInstitutionItem {
  id: string;
  name: string;
  childrenCount: number;
  classesCount: number;
  activeAdventuresCount: number;
}

export interface DashboardInstitutionStats {
  total: number;
  withActiveAdventures: number;
  withNoChildren: number;
  averageChildrenPerInstitution: number;
  averageClassesPerInstitution: number;
  topByChildren: DashboardInstitutionItem[];
}

export interface DashboardTaskTemplateItem {
  id: string;
  titleEn: string;
  type: string;
  usageCount: number;
}

export interface DashboardTaskStats {
  totalTemplates: number;
  templatesByType: {
    instantReward: number;
    textQuestion: number;
    voiceQuestion: number;
    evidenceSubmission: number;
  };
  totalAssignments: number;
  assignmentsByStatus: {
    pending: number;
    inProgress: number;
    reviewRequested: number;
    completed: number;
    rejected: number;
  };
  completionRate: number;
  pendingReview: number;
  topTemplates: DashboardTaskTemplateItem[];
}

export interface DashboardAdventureItem {
  id: string;
  title: string;
  participatingChildren: number;
  completionRate: number;
  averageStarsEarned: number;
}

export interface DashboardAdventureStats {
  totalAdventures: number;
  activeAdventures: number;
  inactiveAdventures: number;
  totalWeeklyAssignments: number;
  weeklyByStatus: {
    active: number;
    completed: number;
    expired: number;
    inactive: number;
  };
  totalParticipatingChildren: number;
  completionRate: number;
  averageStarsEarned: number;
  topByParticipation: DashboardAdventureItem[];
}

export interface DashboardPointsSourceItem {
  source: string;
  totalPoints: number;
  transactionCount: number;
}

export interface DashboardLevelDistributionItem {
  levelId: string;
  levelName: string;
  order: number;
  minPoints: number;
  childrenCount: number;
  percentage: number;
}

export interface DashboardChildItem {
  childId: string;
  name: string;
  avatarUrl?: string | null;
  highestPoints: number;
  levelName: string;
  institutionName?: string | null;
}

export interface DashboardPointsAndLevelsStats {
  totalPointsAwarded: number;
  totalPointsSpentOnGifts: number;
  averagePointsPerChild: number;
  childrenWithZeroPoints: number;
  childrenWithNoLevel: number;
  bySource: DashboardPointsSourceItem[];
  levelDistribution: DashboardLevelDistributionItem[];
  topChildren: DashboardChildItem[];
}

export interface DashboardGiftItem {
  id: string;
  name: string;
  type: string;
  usageCount?: number;
}

export interface DashboardGiftStats {
  totalGifts: number;
  activeGifts: number;
  inactiveGifts: number;
  byType: {
    badge: number;
    character: number;
    other: number;
  };
  totalPurchases: number;
  totalPointsSpent: number;
  topGifts: DashboardGiftItem[];
}

export interface DashboardRecentActivity {
  periodDays: number;
  newUsers: number;
  tasksCompleted: number;
  adventuresCompleted: number;
  levelUps: number;
  giftsPurchased: number;
  notificationsSent: number;
}

export interface PlatformDashboardData {
  generatedAt: string;
  overview: DashboardOverview;
  users: DashboardUserStats;
  institutions: DashboardInstitutionStats;
  tasks: DashboardTaskStats;
  adventures: DashboardAdventureStats;
  pointsAndLevels: DashboardPointsAndLevelsStats;
  gifts: DashboardGiftStats;
  recentActivity: DashboardRecentActivity;
}