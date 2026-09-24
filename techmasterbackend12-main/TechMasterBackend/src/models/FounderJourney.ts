import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface IMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  status: "Active" | "Inactive";
}

export interface IFounderJourney extends Document, ICmsBase {
  hero?: any;
  milestones?: any[];
  roadmap?: any;
  stats?: any;
  seo?: ISeo;
}

const FounderJourneySchema = new Schema<IFounderJourney>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    milestones: { type: [Schema.Types.Mixed], default: [] },
    roadmap: { type: Schema.Types.Mixed, default: {} },
    stats: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const FounderJourney = model<IFounderJourney>("FounderJourney", FounderJourneySchema);
