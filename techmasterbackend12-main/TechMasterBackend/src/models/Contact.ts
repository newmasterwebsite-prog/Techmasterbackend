import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IContactInfoItem {
  type: "email" | "phone" | "address" | "office-hours" | string;
  value: string;
  label: string;
  status: "Active" | "Inactive";
}

export interface IFormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | string;
  required: boolean;
  options?: string[];
  status: "Active" | "Inactive";
}

export interface IContact extends Document, ICmsBase {
  hero?: any;
  info?: any;
  map?: any;
  socials?: any[];
  categories?: any[];
  submissions?: any[];
  seo?: ISeo;
}

const ContactSchema = new Schema<IContact>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    info: { type: Schema.Types.Mixed, default: {} },
    map: { type: Schema.Types.Mixed, default: {} },
    socials: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
    submissions: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Contact = model<IContact>("Contact", ContactSchema);
