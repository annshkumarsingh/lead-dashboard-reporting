import { Request, Response } from "express";
import { ok } from "../utils/apiResponse";
import { exportReport, getFilteredReport } from "../services/report.service";

export async function filtered(req: Request, res: Response) {
  const data = await getFilteredReport(req.query as any);
  return ok(res, data);
}

export async function exportLeads(req: Request, res: Response) {
  const format = req.query.format === "xlsx" ? "xlsx" : "csv";
  const result = await exportReport(req.query as any, format);
  res.setHeader("Content-Type", result.contentType);
  res.setHeader("Content-Disposition", `attachment; filename=${result.filename}`);
  return res.send(result.buffer);
}
