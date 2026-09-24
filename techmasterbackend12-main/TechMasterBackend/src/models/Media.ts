import { Schema, model, Document } from "mongoose";
import { CmsBaseFields, ICmsBase } from "./shared";

export interface IMediaLibrary extends Document, ICmsBase {
  cloudinaryUrl: string;
  publicId: string;
  mediaType: "image" | "video" | "document" | string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
}

const MediaLibrarySchema = new Schema<IMediaLibrary>(
  {
    cloudinaryUrl: { type: String, required: true },
    publicId: { type: String, required: true, unique: true, index: true },
    mediaType: { type: String, required: true, enum: ["image", "video", "document"] },
    fileName: { type: String, required: true, trim: true },
    fileSize: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const MediaLibrary = model<IMediaLibrary>("MediaLibrary", MediaLibrarySchema);
