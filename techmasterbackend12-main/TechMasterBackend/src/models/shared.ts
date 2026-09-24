import { Schema } from "mongoose";

// Reusable Media Schema
export interface IMedia {
  url: string;
  publicId: string;
  mediaType: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  duration?: number;
  fileSize?: number;
}

export const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mediaType: { type: String, required: true, enum: ["image", "video", "document"] },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    fileSize: { type: Number },
  },
  { _id: false }
);

// Reusable SEO Schema
export interface ISeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: IMedia;
  twitterCard?: string;
  robots?: string;
  schemaMarkup?: string;
}

export const SeoSchema = new Schema<ISeo>(
  {
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true },
    openGraphTitle: { type: String, trim: true },
    openGraphDescription: { type: String, trim: true },
    openGraphImage: { type: MediaSchema },
    twitterCard: { type: String, default: "summary_large_image" },
    robots: { type: String, default: "index, follow" },
    schemaMarkup: { type: String, default: "" },
  },
  { _id: false }
);

// Base Fields applied to all CMS Models
export interface ICmsBase {
  status?: string;
  publishStatus?: string;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

export const CmsBaseFields = {
  status: {
    type: String,
    default: "Active",
  },
  publishStatus: {
    type: String,
    default: "Published",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null as any },
};
