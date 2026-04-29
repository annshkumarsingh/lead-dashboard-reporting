import { Request, Response } from "express";
import { ok } from "../utils/apiResponse";
import { getDashboardInsights, getDashboardMetrics } from "../services/dashboard.service";

export async function metrics(_req: Request, res: Response) {
  const data = await getDashboardMetrics();
  return ok(res, data);
}

export async function insights(_req: Request, res: Response) {
  const data = await getDashboardInsights();
  return ok(res, data);
}
