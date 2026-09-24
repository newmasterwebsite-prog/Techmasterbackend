import { BaseService } from "./base.service";
import {
  homepageRepository,
  aboutRepository,
  founderJourneyRepository,
  missionVisionRepository,
  whatWeDoRepository,
  serviceRepository,
  collaborationRepository,
  campaignRepository,
  productLaunchRepository,
  eventRepository,
  portfolioRepository,
  mediaGalleryRepository,
  careerRepository,
  blogRepository,
  faqRepository,
  contactRepository,
  servicesPageRepository,
  websiteSettingsRepository,
  testimonialsPageRepository,
  termsPolicyRepository,
  privacyPolicyRepository,
  cookiePolicyRepository,
  legalSettingsRepository,
} from "../repositories";
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

export const homepageService = new BaseService<IHomepage>(homepageRepository, "Homepage");
export const aboutService = new BaseService<IAbout>(aboutRepository, "About");
export const founderJourneyService = new BaseService<IFounderJourney>(founderJourneyRepository, "FounderJourney");
export const missionVisionService = new BaseService<IMissionVision>(missionVisionRepository, "MissionVision");
export const whatWeDoService = new BaseService<IWhatWeDo>(whatWeDoRepository, "WhatWeDo");
export const serviceService = new BaseService<IService>(serviceRepository, "Service");
export const collaborationService = new BaseService<ICollaboration>(collaborationRepository, "Collaboration");
export const campaignService = new BaseService<ICampaign>(campaignRepository, "Campaign");
export const productLaunchService = new BaseService<IProductLaunch>(productLaunchRepository, "ProductLaunch");
export const eventService = new BaseService<IEvent>(eventRepository, "Event");
export const portfolioService = new BaseService<IPortfolio>(portfolioRepository, "Portfolio");
export const mediaGalleryService = new BaseService<IMediaGallery>(mediaGalleryRepository, "MediaGallery");
export const careerService = new BaseService<ICareer>(careerRepository, "Career");
export const blogService = new BaseService<IBlog>(blogRepository, "Blog");
export const faqService = new BaseService<IFaq>(faqRepository, "Faq");
export const contactService = new BaseService<IContact>(contactRepository, "Contact");
export const servicesPageService = new BaseService<IServicesPage>(servicesPageRepository, 'ServicesPage');
export const websiteSettingsService = new BaseService<IWebsiteSettings>(websiteSettingsRepository, "WebsiteSettings");
export const testimonialsPageService = new BaseService<ITestimonialsPage>(testimonialsPageRepository, "TestimonialsPage");
export const termsPolicyService = new BaseService<ITermsPolicy>(termsPolicyRepository, "TermsPolicy");
export const privacyPolicyService = new BaseService<IPrivacyPolicy>(privacyPolicyRepository, "PrivacyPolicy");
export const cookiePolicyService = new BaseService<ICookiePolicy>(cookiePolicyRepository, "CookiePolicy");
export const legalSettingsService = new BaseService<ILegalSettings>(legalSettingsRepository, "LegalSettings");
