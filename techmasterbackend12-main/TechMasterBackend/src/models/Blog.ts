import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IBlog extends Document, ICmsBase {
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishDate: string;
  date: Date;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  featured?: boolean;
  active?: boolean;
  seo?: ISeo;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, default: "", trim: true },
    slug: { type: String, default: "", lowercase: true, trim: true },
    category: { type: String, default: "Branding", trim: true },
    readTime: { type: String, default: "5 min read" },
    publishDate: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "TechMaster" },
    coverImage: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Pre-save middleware to generate slug if missing
BlogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export const Blog = model<IBlog>("Blog", BlogSchema);
