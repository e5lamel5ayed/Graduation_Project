export interface Child {
  childId: string;
  childName: string;
  nickName: string;
  avatarUrl: string | null;
  age: number;
  totalPoints: number;
  classId: string;
  className: string;
}

export interface ChildsListResponse {
  items: Child[];
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ChildDetailsResponse extends Child {
  parentName: string;
  parentPhone: string;
  adventuresCompleted: number;
  currentAdventures: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'task_completed' | 'adventure_completed' | 'reward_earned' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
}

export interface ChildQueryParams {
  pageNumber?: number;
  pageSize?: number;
  classId?: string;
  searchName?: string;
}

export interface EnrollChildDto {
  classId: string;
  registrationcode: string;
}

export interface DeleteChildDto {
  classId: string;
  childId: string;
}
