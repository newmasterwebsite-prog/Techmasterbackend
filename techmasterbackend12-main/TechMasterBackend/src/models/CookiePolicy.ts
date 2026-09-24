import { Schema, model, Document } from "mongoose";
import { CmsBaseFields, ICmsBase } from "./shared";

export interface ICookieCategory {
  name: string;
  description: string;
  status?: string;
  order?: number;
}

export interface ICookiePolicy extends Document, ICmsBase {
  title: string;
  effectiveDate: string;
  description: string;
  categories?: ICookieCategory[];
}

const CookieCategorySchema = new Schema<ICookieCategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Active" },
  order: { type: Number, default: 1 },
});

const CookiePolicySchema = new Schema<ICookiePolicy>(
  {
    title: { type: String, default: "Cookie Policy" },
    effectiveDate: { type: String, default: "July 7, 2026" },
    description: { type: String, default: "We use cookies to enhance navigation." },
    categories: [CookieCategorySchema],
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const CookiePolicy = model<ICookiePolicy>("CookiePolicy", CookiePolicySchema);
