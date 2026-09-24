import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IStatCounter {
  prefix?: string;
  number: number;
  suffix?: string;
  label: string;
  status: "Active" | "Inactive";
}

export interface ICoreValue {
  title: string;
  description: string;
  icon?: string;
  status: "Active" | "Inactive";
}

export interface IEventCard {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  image?: string;
  banner?: string;
  thumbnail?: string;
  galleryImages?: string[];
  video?: string;
  reel?: string;
  ctaText?: string;
  ctaUrl?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

export interface ICampaignCard {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  video?: string;
  galleryImages?: string[];
  ctaText?: string;
  ctaUrl?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

export interface IFeaturedCampaigns {
  sectionTag?: string;
  smallHeading?: string;
  mainHeading?: string;
  highlightHeading?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  enableSection?: boolean;
  list?: ICampaignCard[];
}

export interface IEventHighlights {
  sectionTag?: string;
  smallHeading?: string;
  mainHeading?: string;
  highlightHeading?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  enableSection?: boolean;
  list?: IEventCard[];
}

export interface IBrandPartner {
  id?: string;
  brandName: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  showYouTube?: boolean;
  showInstagram?: boolean;
  brandLogo?: string;
  logo?: string;
  website?: string;
  themeColor?: string;
  status?: string;
  order?: number;
}

export interface IBrandCollaborationItem {
  id?: string;
  brandName: string;
  logo?: string;
  brandLogo?: string;
  status?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeaturedVideoItem {
  id?: string;
  youtubeUrl: string;
  videoId: string;
  startTime?: string | number;
  endTime?: string | number;
  order?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHomepage extends Document, ICmsBase {
  hero?: any;
  introVision?: any;
  founder?: any;
  channelsTicker?: any;
  coreValues?: any;
  statistics?: any;
  shortsReels?: any;
  longVideos?: any;
  brandCollaborations?: any;
  newsletterContact?: any;
  statisticsCounters?: any[];
  brandPartners?: any[];
  brandCollaborationsList?: any[];
  featuredVideos?: any[];
  seo?: ISeo;
}

const HomepageSchema = new Schema<IHomepage>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    introVision: { type: Schema.Types.Mixed, default: {} },
    founder: { type: Schema.Types.Mixed, default: {} },
    channelsTicker: { type: Schema.Types.Mixed, default: {} },
    coreValues: { type: Schema.Types.Mixed, default: {} },
    statistics: { type: Schema.Types.Mixed, default: {} },
    shortsReels: { type: Schema.Types.Mixed, default: {} },
    longVideos: { type: Schema.Types.Mixed, default: {} },
    brandCollaborations: { type: Schema.Types.Mixed, default: {} },
    newsletterContact: { type: Schema.Types.Mixed, default: {} },
    statisticsCounters: { type: [Schema.Types.Mixed], default: [] },
    brandPartners: { type: [Schema.Types.Mixed], default: [] },
    brandCollaborationsList: { type: [Schema.Types.Mixed], default: [] },
    featuredVideos: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Homepage = model<IHomepage>("Homepage", HomepageSchema);
