import { Router } from "express";
import * as controller from "../controllers/report.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { leadQuerySchema } from "../validators/lead.validator";

const router = Router();

router.get("/leads", validateRequest(leadQuerySchema), asyncHandler(controller.filtered));
router.get("/leads/export", asyncHandler(controller.exportLeads));

export default router;
