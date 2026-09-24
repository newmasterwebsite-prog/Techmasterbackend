import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IPortfolio extends Document, ICmsBase {
  hero?: any;
  channels?: any[];
  categories?: any[];
  projects?: any[];
  seo?: ISeo;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    channels: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
    projects: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Portfolio = model<IPortfolio>("Portfolio", PortfolioSchema);
