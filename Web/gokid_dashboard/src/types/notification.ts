export type NotificationType =
  | 'SupervisorAssignedToClass'
  | 'SupervisorUnassignedFromClass'
  | 'NewChildrenInClass'
  | 'ChildRemovedFromClass'
  | 'AdventureAssignedToClass'
  | 'AdventureStarted'
  | 'AdventureNewDay'
  | 'AdventureDayCompleted'
  | 'DailyAdventureTasksAssigned'
  | 'TaskApproved'
  | 'TaskRejected'
  | 'LevelUp'
  | 'StoryVoiceReady'
  | 'StoryVoiceFailed'
  | string;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedEntityId?: string | null;
  isRead: boolean;
  createdAt: string;
}