import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface IService extends Document, ICmsBase {
  servicesPageData?: any;
  servicesData?: any[];
  title?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  features?: any[];
  icon?: string;
  accentColor?: string;
  overview?: string;
  benefits?: any[];
  process?: any[];
  gallery?: any[];
  ctaText?: string;
  ctaUrl?: string;
  displayOrder?: number;
  seo?: ISeo;
}

const ServiceSchema = new Schema<IService>(
  {
    servicesPageData: { type: Schema.Types.Mixed, default: {} },
    servicesData: { type: [Schema.Types.Mixed], default: [] },
    title: { type: String, default: "", trim: true },
    slug: { type: String, default: "", lowercase: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    features: [{ type: Schema.Types.Mixed }],
    icon: { type: String, default: "Cpu" },
    accentColor: { type: String, default: "#D4AF37" },
    overview: { type: String },
    benefits: [{ type: Schema.Types.Mixed }],
    process: [{ type: Schema.Types.Mixed }],
    gallery: [{ type: String }],
    ctaText: { type: String },
    ctaUrl: { type: String },
    displayOrder: { type: Number, default: 0 },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Service = model<IService>("Service", ServiceSchema);
