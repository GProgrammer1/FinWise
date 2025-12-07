export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UpcomingExpense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval' | 'rejection' | 'warning' | 'overspending';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CategoryLimit {
  category: string;
  limit: number;
  current: number;
}

export interface BudgetRecommendation {
  total: number;
  categories: {
    category: string;
    recommended: number;
    current: number;
  }[];
  insights: string[];
  safetyScore: number;
}

