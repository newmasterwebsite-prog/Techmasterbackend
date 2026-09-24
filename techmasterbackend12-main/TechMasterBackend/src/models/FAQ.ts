import { Schema, model, Document } from "mongoose";
import { CmsBaseFields, ICmsBase } from "./shared";

export interface IFaq extends Document, ICmsBase {
  settings?: any;
  faqs?: any[];
  question?: string;
  answer?: string;
  order?: number;
}

const FaqSchema = new Schema<IFaq>(
  {
    settings: { type: Schema.Types.Mixed, default: {} },
    faqs: { type: [Schema.Types.Mixed], default: [] },
    question: { type: String, default: "", trim: true },
    answer: { type: String, default: "" },
    order: { type: Number, default: 0 },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Faq = model<IFaq>("Faq", FaqSchema);
