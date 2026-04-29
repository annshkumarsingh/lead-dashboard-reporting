import { Router } from "express";
import * as controller from "../controllers/dashboard.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/metrics", asyncHandler(controller.metrics));
router.get("/insights", asyncHandler(controller.insights));

export default router;
