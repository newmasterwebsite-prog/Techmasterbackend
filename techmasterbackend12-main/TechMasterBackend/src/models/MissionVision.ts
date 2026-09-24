import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface ICoreValueItem {
  title: string;
  description: string;
  icon?: string;
  status: "Active" | "Inactive";
}

export interface IBrandPillar {
  title: string;
  description: string;
  image?: IMedia;
  status: "Active" | "Inactive";
}

export interface IRoadmapItem {
  phase: string;
  title: string;
  description: string;
  dateRange: string;
  status: "Active" | "Inactive";
}

export interface IMissionVision extends Document, ICmsBase {
  hero?: any;
  mission?: any;
  vision?: any;
  coreValuesHeader?: any;
  coreValues?: any[];
  brandPillarsHeader?: any;
  brandPillars?: any[];
  roadmapHeader?: any;
  roadmap?: any[];
  cta?: any;
  seo?: ISeo;
}

const MissionVisionSchema = new Schema<IMissionVision>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    mission: { type: Schema.Types.Mixed, default: {} },
    vision: { type: Schema.Types.Mixed, default: {} },
    coreValuesHeader: { type: Schema.Types.Mixed, default: {} },
    coreValues: { type: [Schema.Types.Mixed], default: [] },
    brandPillarsHeader: { type: Schema.Types.Mixed, default: {} },
    brandPillars: { type: [Schema.Types.Mixed], default: [] },
    roadmapHeader: { type: Schema.Types.Mixed, default: {} },
    roadmap: { type: [Schema.Types.Mixed], default: [] },
    cta: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const MissionVision = model<IMissionVision>("MissionVision", MissionVisionSchema);
