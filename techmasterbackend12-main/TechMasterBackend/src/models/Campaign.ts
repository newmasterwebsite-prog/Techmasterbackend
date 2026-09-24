import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface ICampaign extends Document, ICmsBase {
  hero?: any;
  campaignsList?: any[];
  campaigns?: any[];
  process?: any[];
  successStories?: any[];
  seo?: ISeo;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    campaignsList: { type: [Schema.Types.Mixed], default: [] },
    campaigns: { type: [Schema.Types.Mixed], default: [] },
    process: { type: [Schema.Types.Mixed], default: [] },
    successStories: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Campaign = model<ICampaign>("Campaign", CampaignSchema);
