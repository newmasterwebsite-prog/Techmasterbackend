import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IBrandCarouselItem {
  name: string;
  logo: IMedia;
  link?: string;
  status: "Active" | "Inactive";
}

export interface IPartner {
  partnerName: string;
  logo: IMedia;
  description?: string;
  status: "Active" | "Inactive";
}

export interface ICollabMetric {
  number: string;
  label: string;
  status: "Active" | "Inactive";
}

export interface ICollabProcess {
  step: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
}

export interface ICollaboration extends Document, ICmsBase {
  hero?: any;
  brandCarousel?: any[];
  partners?: any[];
  metrics?: any[];
  campaigns?: any[];
  history?: any;
  process?: any[];
  testimonials?: any[];
  seo?: ISeo;
}

const CollaborationSchema = new Schema<ICollaboration>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    brandCarousel: { type: [Schema.Types.Mixed], default: [] },
    partners: { type: [Schema.Types.Mixed], default: [] },
    metrics: { type: [Schema.Types.Mixed], default: [] },
    campaigns: { type: [Schema.Types.Mixed], default: [] },
    history: { type: Schema.Types.Mixed, default: {} },
    process: { type: [Schema.Types.Mixed], default: [] },
    testimonials: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Collaboration = model<ICollaboration>("Collaboration", CollaborationSchema);
