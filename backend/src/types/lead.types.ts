export const LeadStatuses = ["New", "Interested", "Converted", "Rejected"] as const;
export type LeadStatus = (typeof LeadStatuses)[number];

export interface LeadFilters {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  city?: string;
  status?: LeadStatus;
  service?: string;
  search?: string;
}
