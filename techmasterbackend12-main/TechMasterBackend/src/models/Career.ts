import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface ICareer extends Document, ICmsBase {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  requirements: string[];
  salaryRange?: string;
  seo?: ISeo;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, default: "", trim: true },
    location: { type: String, default: "Remote", trim: true },
    type: {
      type: String,
      default: "Full-time",
    },
    description: { type: String, default: "" },
    requirements: [{ type: String, default: "" }],
    salaryRange: { type: String, default: "" },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const Career = model<ICareer>("Career", CareerSchema);
