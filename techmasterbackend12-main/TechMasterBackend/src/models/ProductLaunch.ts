import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IProductLaunch extends Document, ICmsBase {
  hero?: any;
  products?: any[];
  featureVideo?: any;
  initiativesHeader?: any;
  initiatives?: any[];
  downloads?: any[];
  seo?: ISeo;
}

const ProductLaunchSchema = new Schema<IProductLaunch>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    products: { type: [Schema.Types.Mixed], default: [] },
    featureVideo: { type: Schema.Types.Mixed, default: {} },
    initiativesHeader: { type: Schema.Types.Mixed, default: {} },
    initiatives: { type: [Schema.Types.Mixed], default: [] },
    downloads: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const ProductLaunch = model<IProductLaunch>("ProductLaunch", ProductLaunchSchema);
