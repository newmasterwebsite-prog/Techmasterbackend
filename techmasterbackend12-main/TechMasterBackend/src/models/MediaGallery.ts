import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IMediaGallery extends Document, ICmsBase {
  title: string;
  category: "Photos" | "Videos" | "Press" | string;
  mediaFile: IMedia;
  thumbnailFile?: IMedia;
  seo?: ISeo;
}

const MediaGallerySchema = new Schema<IMediaGallery>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: "Photos", trim: true },
    mediaFile: { type: MediaSchema, required: true },
    thumbnailFile: { type: MediaSchema },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const MediaGallery = model<IMediaGallery>("MediaGallery", MediaGallerySchema);
