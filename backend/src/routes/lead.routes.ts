import { Router } from "express";
import * as controller from "../controllers/lead.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { createLeadSchema, leadQuerySchema, updateLeadSchema } from "../validators/lead.validator";

const router = Router();

router.get("/distinct", asyncHandler(controller.distinct));
router.post("/", validateRequest(createLeadSchema), asyncHandler(controller.create));
router.get("/", validateRequest(leadQuerySchema), asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.getOne));
router.patch("/:id", validateRequest(updateLeadSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.remove));

export default router;
