export interface Task {
  id: string;
  title: string;
  memo: string;
  deadline?: string;
  notifyAfterMinutes: number | null;
  priority: number;
  displayIndex?: number;
  manualOrder?: number;
  createdAt: number;
  notified?: boolean;
  deadlineNotified?: boolean;
}

