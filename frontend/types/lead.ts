export type LeadStatus = "New" | "Interested" | "Converted" | "Rejected";

export interface Lead {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  service: string;
  budget: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardMetrics {
  totalLeads: number;
  conversionRate: number;
  statusBreakdown: { status: LeadStatus; count: number }[];
  cityDistribution: { city: string; count: number }[];
  serviceDistribution: { service: string; count: number }[];
  budgetStats: { totalBudget: number; averageBudget: number };
  recentLeads: Lead[];
}
