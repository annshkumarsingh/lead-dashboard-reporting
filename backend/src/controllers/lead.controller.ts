import { Request, Response } from "express";
import { created, ok } from "../utils/apiResponse";
import * as leadService from "../services/lead.service";

type IdParams = {
  id: string;
};

export async function create(req: Request, res: Response) {
  const lead = await leadService.createLead(req.body);
  return created(res, lead, "Lead created successfully");
}

export async function list(req: Request, res: Response) {
  const data = await leadService.listLeads(req.query as any);
  return ok(res, data);
}

export async function getOne(req: Request<IdParams>, res: Response) {
  const lead = await leadService.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  return ok(res, lead);
}

export async function update(req: Request<IdParams>, res: Response) {
  const lead = await leadService.updateLead(req.params.id, req.body);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  return ok(res, lead, "Lead updated successfully");
}

export async function remove(req: Request<IdParams>, res: Response) {
  const lead = await leadService.deleteLead(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  return ok(res, lead, "Lead deleted successfully");
}

export async function distinct(req: Request, res: Response) {
  const data = await leadService.getDistinctValues();
  return ok(res, data);
}
