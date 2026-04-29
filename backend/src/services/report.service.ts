import ExcelJS from "exceljs";
import { stringify } from "csv-stringify/sync";
import { LeadModel } from "../models/lead.model";
import { LeadFilters } from "../types/lead.types";
import { buildLeadQuery } from "./lead.service";

export async function getFilteredReport(filters: LeadFilters) {
  const page = Math.max(Number(filters.page || 1), 1);
  const limit = Math.min(Math.max(Number(filters.limit || 20), 1), 200);
  const skip = (page - 1) * limit;
  const query = buildLeadQuery(filters);

  const [items, total] = await Promise.all([
    LeadModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LeadModel.countDocuments(query),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function exportReport(filters: LeadFilters, format: "csv" | "xlsx") {
  const query = buildLeadQuery(filters);
  const rows = await LeadModel.find(query).sort({ createdAt: -1 }).limit(10000).lean();

  const normalized = rows.map((lead) => ({
    Name: lead.name,
    Mobile: lead.mobile,
    Email: lead.email,
    City: lead.city,
    Service: lead.service,
    Budget: lead.budget,
    Status: lead.status,
    CreatedAt: lead.createdAt,
  }));

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leads Report");
    sheet.columns = Object.keys(normalized[0] || { Name: "" }).map((key) => ({ header: key, key, width: 22 }));
    sheet.addRows(normalized);
    sheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    return { buffer, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename: "leads-report.xlsx" };
  }

  const csv = stringify(normalized, { header: true });
  return { buffer: Buffer.from(csv), contentType: "text/csv", filename: "leads-report.csv" };
}
