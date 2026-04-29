import { FilterQuery } from "mongoose";
import { LeadModel, LeadDocument } from "../models/lead.model";
import { LeadFilters } from "../types/lead.types";

export function buildLeadQuery(filters: LeadFilters): FilterQuery<LeadDocument> {
  const query: FilterQuery<LeadDocument> = {};

  if (filters.fromDate || filters.toDate) {
    query.createdAt = {};
    if (filters.fromDate) query.createdAt.$gte = new Date(filters.fromDate);
    if (filters.toDate) {
      const end = new Date(filters.toDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const city = filters.city?.trim();
  const status = filters.status?.trim();
  const service = filters.service?.trim();
  const searchText = filters.search?.trim();

  if (city) {
    query.city = new RegExp(escapeRegex(city), "i");
  }

  if (status) {
    query.status = status;
  }

  if (service) {
    query.service = new RegExp(escapeRegex(service), "i");
  }

  if (searchText) {
    const search = new RegExp(escapeRegex(searchText), "i");

    query.$or = [
      { name: search },
      { email: search },
      { mobile: search },
      { city: search },
      { service: search },
      { status: search },
    ];
  }

  return query;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createLead(payload: Partial<LeadDocument>) {
  const email = String(payload.email || "").trim().toLowerCase();
  const mobile = String(payload.mobile || "").trim();

  if (!email || !mobile) {
    const error = new Error("Email and mobile are required.") as Error & {
      statusCode?: number;
      code?: string;
    };

    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";

    throw error;
  }

  const existingLead = await LeadModel.findOne({
    $or: [
      { email },
      { mobile },
    ],
  })
    .select("email mobile name")
    .lean();

  if (existingLead) {
    const duplicateFields: string[] = [];

    if (existingLead.email?.toLowerCase() === email) {
      duplicateFields.push("email");
    }

    if (existingLead.mobile === mobile) {
      duplicateFields.push("mobile");
    }

    const message =
      duplicateFields.length === 2
        ? "A lead with this email and mobile number already exists."
        : duplicateFields[0] === "email"
          ? "A lead with this email already exists."
          : "A lead with this mobile number already exists.";

    const error = new Error(message) as Error & {
      statusCode?: number;
      code?: string;
      duplicateFields?: string[];
    };

    error.statusCode = 409;
    error.code = "DUPLICATE_LEAD";
    error.duplicateFields = duplicateFields;

    throw error;
  }

  const lead = await LeadModel.create({
    ...payload,
    email,
    mobile,
  });

  return lead.toObject();
}

export async function listLeads(filters: LeadFilters) {
  const page = Math.max(Number(filters.page || 1), 1);
  const limit = Math.min(Math.max(Number(filters.limit || 10), 1), 100);
  const skip = (page - 1) * limit;
  const query = buildLeadQuery(filters);

  const [items, total] = await Promise.all([
    LeadModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LeadModel.countDocuments(query),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getLeadById(id: string) {
  return LeadModel.findById(id).lean();
}

export async function updateLead(id: string, payload: Partial<LeadDocument>) {
  return LeadModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
}

export async function deleteLead(id: string) {
  return LeadModel.findByIdAndDelete(id).lean();
}

export async function getDistinctValues() {
  const [cities, services] = await Promise.all([
    LeadModel.distinct("city"),
    LeadModel.distinct("service"),
  ]);
  return { cities: cities.sort(), services: services.sort() };
}
