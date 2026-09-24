import { BaseController } from "./base.controller";
import {
  homepageService,
  aboutService,
  founderJourneyService,
  missionVisionService,
  whatWeDoService,
  serviceService,
  collaborationService,
  campaignService,
  productLaunchService,
  eventService,
  portfolioService,
  mediaGalleryService,
  careerService,
  blogService,
  faqService,
  contactService,
  servicesPageService,
  websiteSettingsService,
  testimonialsPageService,
  termsPolicyService,
  privacyPolicyService,
  cookiePolicyService,
  legalSettingsService,
} from "../services";
import { IHomepage } from "../models/Homepage";
import { IAbout } from "../models/About";
import { IFounderJourney } from "../models/FounderJourney";
import { IMissionVision } from "../models/MissionVision";
import { IWhatWeDo } from "../models/WhatWeDo";
import { IService } from "../models/Service";
import { ICollaboration } from "../models/Collaboration";
import { ICampaign } from "../models/Campaign";
import { IProductLaunch } from "../models/ProductLaunch";
import { IEvent } from "../models/Event";
import { IPortfolio } from "../models/Portfolio";
import { IMediaGallery } from "../models/MediaGallery";
import { ICareer } from "../models/Career";
import { IBlog } from "../models/Blog";
import { IFaq } from "../models/FAQ";
import { IContact } from "../models/Contact";
import { IServicesPage } from '../models/ServicesPage';
import { IWebsiteSettings } from "../models/WebsiteSettings";
import { ITestimonialsPage } from "../models/TestimonialsPage";
import { ITermsPolicy } from "../models/TermsPolicy";
import { IPrivacyPolicy } from "../models/PrivacyPolicy";
import { ICookiePolicy } from "../models/CookiePolicy";
import { ILegalSettings } from "../models/LegalSettings";

export const homepageController = new BaseController<IHomepage>(homepageService, "Homepage");
export const aboutController = new BaseController<IAbout>(aboutService, "About");
export const founderJourneyController = new BaseController<IFounderJourney>(founderJourneyService, "FounderJourney");
export const missionVisionController = new BaseController<IMissionVision>(missionVisionService, "MissionVision");
export const whatWeDoController = new BaseController<IWhatWeDo>(whatWeDoService, "WhatWeDo");
export const serviceController = new BaseController<IService>(serviceService, "Service");
export const collaborationController = new BaseController<ICollaboration>(collaborationService, "Collaboration");
export const campaignController = new BaseController<ICampaign>(campaignService, "Campaign");
export const productLaunchController = new BaseController<IProductLaunch>(productLaunchService, "ProductLaunch");
export const eventController = new BaseController<IEvent>(eventService, "Event");
export const portfolioController = new BaseController<IPortfolio>(portfolioService, "Portfolio");
export const mediaGalleryController = new BaseController<IMediaGallery>(mediaGalleryService, "MediaGallery");
export const careerController = new BaseController<ICareer>(careerService, "Career");
export const blogController = new BaseController<IBlog>(blogService, "Blog");
export const faqController = new BaseController<IFaq>(faqService, "Faq");
export const contactController = new BaseController<IContact>(contactService, "Contact");
export const servicesPageController = new BaseController<IServicesPage>(servicesPageService, 'ServicesPage');
export const websiteSettingsController = new BaseController<IWebsiteSettings>(websiteSettingsService, "WebsiteSettings");
export const testimonialsPageController = new BaseController<ITestimonialsPage>(testimonialsPageService, "TestimonialsPage");
export const termsPolicyController = new BaseController<ITermsPolicy>(termsPolicyService, "TermsPolicy");
export const privacyPolicyController = new BaseController<IPrivacyPolicy>(privacyPolicyService, "PrivacyPolicy");
export const cookiePolicyController = new BaseController<ICookiePolicy>(cookiePolicyService, "CookiePolicy");
export const legalSettingsController = new BaseController<ILegalSettings>(legalSettingsService, "LegalSettings");
export { BaseController };
