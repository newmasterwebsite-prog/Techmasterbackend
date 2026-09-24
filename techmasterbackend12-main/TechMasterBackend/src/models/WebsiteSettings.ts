import { Schema, model, Document } from "mongoose";
import { MediaSchema, CmsBaseFields, ICmsBase, IMedia } from "./shared";

export interface ISocialLink {
  platform: string;
  url: string;
  status: "Active" | "Inactive";
}

export interface IWebsiteSettings extends Document, ICmsBase {
  companyName: string;
  companyLogo?: IMedia;
  favicon?: IMedia;
  email: string;
  phone: string;
  whatsApp?: string;
  address?: string;
  googleMapsUrl?: string;
  socialLinks?: ISocialLink[];
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    customHeadScripts?: string;
  };
  themeSettings?: {
    primaryColor?: string;
    secondaryColor?: string;
    darkModeDefault?: boolean;
  };
  footerText?: string;
  copyrightText?: string;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    companyName: { type: String, default: "", trim: true },
    companyLogo: { type: MediaSchema },
    favicon: { type: MediaSchema },
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    whatsApp: { type: String, trim: true },
    address: { type: String },
    googleMapsUrl: { type: String },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
      },
    ],
    analytics: {
      googleAnalyticsId: { type: String, default: "" },
      facebookPixelId: { type: String, default: "" },
      customHeadScripts: { type: String, default: "" },
    },
    themeSettings: {
      primaryColor: { type: String, default: "#D4AF37" },
      secondaryColor: { type: String, default: "#0D0D0D" },
      darkModeDefault: { type: Boolean, default: true },
    },
    footerText: { type: String, default: "" },
    copyrightText: { type: String, default: "" },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const WebsiteSettings = model<IWebsiteSettings>("WebsiteSettings", WebsiteSettingsSchema);
