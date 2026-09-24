import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface IStatistic {
  label: string;
  value: string;
}

export interface ITestimonial {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IServicesPage extends Document, ICmsBase {
  hero: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
    bgVideo?: string;
  };
  statistics: IStatistic[];
  testimonials: ITestimonial[];
  faqs: IFAQ[];
  gallery: string[];
  cta: {
    heading: string;
    subtext: string;
    buttonText: string;
    buttonUrl: string;
  };
  seo?: ISeo;
}

const StatisticSchema = new Schema<IStatistic>({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const TestimonialSchema = new Schema<ITestimonial>({
  quote: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const ServicesPageSchema = new Schema<IServicesPage>(
  {
    hero: {
      badge: { type: String, default: "CORE PORTALS" },
      title: { type: String, default: "Services, Courses & " },
      highlightText: { type: String, default: "Keynote Bookings." },
      description: { type: String, default: "Explore our expert services." },
      bgVideo: { type: String },
    },
    statistics: [StatisticSchema],
    testimonials: [TestimonialSchema],
    faqs: [FAQSchema],
    gallery: [{ type: String }],
    cta: {
      heading: { type: String, default: "Ready to Transform Your Business?" },
      subtext: { type: String, default: "Let's discuss how we can help you achieve your goals." },
      buttonText: { type: String, default: "Contact Us" },
      buttonUrl: { type: String, default: "/contact" },
    },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const ServicesPage = model<IServicesPage>("ServicesPage", ServicesPageSchema);
