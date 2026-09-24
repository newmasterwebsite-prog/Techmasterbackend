import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IEvent extends Document, ICmsBase {
  hero?: any;
  eventsList?: any[];
  engagementTypesHeader?: any;
  engagementTypes?: any[];
  bookingSection?: any;
  bookingInquiries?: any[];
  seo?: ISeo;
}

const EventSchema = new Schema<IEvent>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    eventsList: { type: [Schema.Types.Mixed], default: [] },
    engagementTypesHeader: { type: Schema.Types.Mixed, default: {} },
    engagementTypes: { type: [Schema.Types.Mixed], default: [] },
    bookingSection: { type: Schema.Types.Mixed, default: {} },
    bookingInquiries: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Event = model<IEvent>("Event", EventSchema);
