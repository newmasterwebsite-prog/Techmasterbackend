import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface ISuccessStat {
  label: string;
  value: string;
  suffix?: string;
  icon?: string;
  color?: string;
  order?: number;
  status?: string;
}

export interface IVideoTestimonial {
  name: string;
  role: string;
  company: string;
  thumbnail: string;
  video: string;
  duration?: string;
  description?: string;
  rating?: number;
  featured?: boolean;
  order?: number;
  status?: string;
}

export interface IWrittenTestimonial {
  name: string;
  designation: string;
  company: string;
  photo: string;
  review: string;
  rating?: number;
  logo?: string;
  featured?: boolean;
  status?: string;
  order?: number;
}

export interface ICategoryItem {
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  status?: string;
}

export interface IWhatWeDoItem {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  status?: string;
}

export interface ITestimonialsPage extends Document, ICmsBase {
  hero?: any;
  successStats?: any[];
  videoTestimonials?: any[];
  writtenTestimonials?: any[];
  categories?: any[];
  featuredQuote?: any;
  whatWeDo?: any[];
  seo?: ISeo;
  sectionSettings?: Record<string, any>;
}

const TestimonialsPageSchema = new Schema<ITestimonialsPage>(
  {
    hero: { type: Schema.Types.Mixed, default: {} },
    successStats: { type: [Schema.Types.Mixed], default: [] },
    videoTestimonials: { type: [Schema.Types.Mixed], default: [] },
    writtenTestimonials: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
    featuredQuote: { type: Schema.Types.Mixed, default: {} },
    whatWeDo: { type: [Schema.Types.Mixed], default: [] },
    seo: { type: SeoSchema },
    sectionSettings: { type: Schema.Types.Mixed, default: {} },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const TestimonialsPage = model<ITestimonialsPage>("TestimonialsPage", TestimonialsPageSchema);
