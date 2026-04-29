import { z } from "zod";
import { LeadStatuses } from "../types/lead.types";

const statusEnum = z.enum(LeadStatuses);

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    mobile: z.string().min(7).max(20),
    email: z.string().email().max(120),
    city: z.string().min(2).max(80),
    service: z.string().min(2).max(120),
    budget: z.coerce.number().nonnegative(),
    status: statusEnum.default("New"),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: createLeadSchema.shape.body.partial(),
});

export const leadQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    city: z.string().optional(),
    status: statusEnum.optional(),
    service: z.string().optional(),
    search: z.string().optional(),
  }),
});
