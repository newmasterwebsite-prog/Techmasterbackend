import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IOperationItem {
  title: string;
  description: string;
  icon?: string;
  status: "Active" | "Inactive";
}

export interface IServiceListItem {
  title: string;
  description: string;
  status: "Active" | "Inactive";
}

export interface IWhatWeDo extends Document, ICmsBase {
  hero?: any;
  operations?: any[];
  servicesHeader?: any;
  servicesList?: any[];
  quoteBanner?: any;
  seo?: ISeo;
}

const WhatWeDoSchema = new Schema<IWhatWeDo>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    operations: { type: [Schema.Types.Mixed], default: [] },
    servicesHeader: { type: Schema.Types.Mixed, default: {} },
    servicesList: { type: [Schema.Types.Mixed], default: [] },
    quoteBanner: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const WhatWeDo = model<IWhatWeDo>("WhatWeDo", WhatWeDoSchema);
