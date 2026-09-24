import { Schema, model, Document } from "mongoose";
import { MediaSchema, SeoSchema, CmsBaseFields, ICmsBase, IMedia, ISeo } from "./shared";

export interface IHighlight {
  prefix?: string;
  number: number;
  suffix?: string;
  label: string;
  status: "Active" | "Inactive";
}

export interface ICoreCollaborator {
  id: string;
  name: string;
  role?: string;
  company?: string;
  description?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  active?: boolean;
  order?: number;
}

export interface ICoreCollaboratorsSection {
  sectionTag?: string;
  smallHeading?: string;
  mainHeading?: string;
  highlightHeading?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  enableSection?: boolean;
  list?: ICoreCollaborator[];
}

export interface IAboutTechMaster {
  smallBadge?: string;
  mainHeading?: string;
  highlightedHeading?: string;
  description?: string;
  backgroundMedia?: string;
  order?: number;
  visibility?: boolean;
  status?: "Published" | "Draft";
}

export interface ICultureSection {
  smallBadge?: string;
  mainHeading?: string;
  highlightedText?: string;
  description?: string;
  bgStyle?: string;
  borderStyle?: string;
  order?: number;
  visibility?: boolean;
  status?: "Published" | "Draft";
}

export interface IStudioCardSection {
  imageUrl?: string;
  imageAlt?: string;
  imageSubtitle?: string;
  imageDescription?: string;
  overlayCaption?: string;
  visibility?: boolean;
  order?: number;
}

export interface IPhilosophySection {
  smallBadge?: string;
  quote?: string;
  description?: string;
  founderName?: string;
  founderDesignation?: string;
  profileImageUrl?: string;
  showDivider?: boolean;
  order?: number;
  visibility?: boolean;
  status?: "Published" | "Draft";
}

export interface IAbout extends Document, ICmsBase {
  aboutTechMaster?: IAboutTechMaster;
  culture?: ICultureSection;
  studioCard?: IStudioCardSection;
  philosophy?: IPhilosophySection;
  introduction?: {
    founderName?: string;
    designation?: string;
    shortDescription?: string;
    profileImage?: IMedia;
    profileImageUrl?: string;
  };
  story?: {
    imageUrl?: string;
  };
  highlights?: IHighlight[];
  coreCollaborators?: ICoreCollaboratorsSection;
  seo?: ISeo;
}

const AboutSchema = new Schema<IAbout>(
  {
    aboutTechMaster: {
      smallBadge: { type: String, default: "ABOUT TECH MASTER" },
      mainHeading: { type: String, default: "What Tech Master Is" },
      highlightedHeading: { type: String, default: "Tech Master" },
      description: { type: String, default: "It started in 2019 one person, one channel, and a belief that tech content in India could be smarter than it was. That belief became Tech Master, and by 2023, it had become a company. Today, Tech Master Digital Pvt Ltd is a 50+ person team running four established channels across tech, automobiles, and entertainment with a fifth already taking shape in 3D animation out of a full production studio in Jaipur, complete with an in-house editing suite, animation team, and gaming studio. Today our content generates 1B+ views every month." },
      backgroundMedia: { type: String, default: "" },
      order: { type: Number, default: 1 },
      visibility: { type: Boolean, default: true },
      status: { type: String, enum: ["Published", "Draft"], default: "Published" }
    },
    culture: {
      smallBadge: { type: String, default: "OUR CULTURE" },
      mainHeading: { type: String, default: "Good People." },
      highlightedText: { type: String, default: "Good Work. Good Vibes" },
      description: { type: String, default: "Ideas get clashed over here, not because we're trying to prove a point, but because everyone actually cares. We push each other, we push ourselves but nobody's burning out to do it. Somewhere between the deadlines and the chai breaks, this team just falls into a rhythm. Good People. Good Work. Good Vibes" },
      bgStyle: { type: String, default: "glass" },
      borderStyle: { type: String, default: "gold-subtle" },
      order: { type: Number, default: 2 },
      visibility: { type: Boolean, default: true },
      status: { type: String, enum: ["Published", "Draft"], default: "Published" }
    },
    studioCard: {
      imageUrl: { type: String, default: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
      imageAlt: { type: String, default: "Tech Master Team" },
      imageSubtitle: { type: String, default: "Jaipur Studio" },
      imageDescription: { type: String, default: "50+ Person Production & Gaming Suite" },
      overlayCaption: { type: String, default: "" },
      visibility: { type: Boolean, default: true },
      order: { type: Number, default: 3 }
    },
    philosophy: {
      smallBadge: { type: String, default: "FOUNDER PHILOSOPHY" },
      quote: { type: String, default: "Information is Wealth." },
      description: { type: String, default: "Information is Wealth." },
      founderName: { type: String, default: "Tech Master Founder" },
      founderDesignation: { type: String, default: "Founder & CEO" },
      profileImageUrl: { type: String, default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" },
      showDivider: { type: Boolean, default: true },
      order: { type: Number, default: 4 },
      visibility: { type: Boolean, default: true },
      status: { type: String, enum: ["Published", "Draft"], default: "Published" }
    },
    introduction: {
      founderName: { type: String, default: "" },
      designation: { type: String, default: "" },
      shortDescription: { type: String, default: "" },
      profileImage: { type: MediaSchema },
      profileImageUrl: { type: String, default: "" }
    },
    story: {
      imageUrl: { type: String, default: "" }
    },
    highlights: [
      {
        prefix: { type: String, default: "" },
        number: { type: Number, required: true },
        suffix: { type: String, default: "" },
        label: { type: String, required: true },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
      },
    ],
    coreCollaborators: {
      sectionTag: { type: String, default: "" },
      smallHeading: { type: String, default: "" },
      mainHeading: { type: String, default: "" },
      highlightHeading: { type: String, default: "" },
      description: { type: String, default: "" },
      backgroundImage: { type: String, default: "" },
      backgroundVideo: { type: String, default: "" },
      enableSection: { type: Boolean, default: true },
      list: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          role: { type: String, default: "" },
          company: { type: String, default: "" },
          description: { type: String, default: "" },
          image: { type: String, default: "" },
          linkedin: { type: String, default: "" },
          twitter: { type: String, default: "" },
          instagram: { type: String, default: "" },
          website: { type: String, default: "" },
          active: { type: Boolean, default: true },
          order: { type: Number, default: 0 }
        }
      ]
    },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const About = model<IAbout>("About", AboutSchema);

