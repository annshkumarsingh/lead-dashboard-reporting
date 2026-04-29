import { Schema, model, InferSchemaType } from "mongoose";
import { LeadStatuses } from "../types/lead.types";

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    mobile: { type: String, required: true, trim: true, maxlength: 20, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120, index: true },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    service: { type: String, required: true, trim: true, maxlength: 120 },
    budget: { type: Number, required: true, min: 0 },
    status: { type: String, enum: LeadStatuses, default: "New", index: true },
  },
  { timestamps: true, versionKey: false }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ city: 1 });
leadSchema.index({ service: 1 });
leadSchema.index({ city: 1, status: 1, service: 1, createdAt: -1 });
leadSchema.index({ name: "text", email: "text", mobile: "text" });
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ mobile: 1 }, { unique: true });

export type LeadDocument = InferSchemaType<typeof leadSchema> & { _id: string };
export const LeadModel = model("Lead", leadSchema);
