import { Router } from "express";
import path from "path";
import fs from "fs";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { parseDocument } from "../middlewares/upload.middleware";
import CloudinaryService from "../services/cloudinary.service";

import homepageRoutes from "./homepage.routes";
import aboutRoutes from "./about.routes";
import founderJourneyRoutes from "./founderJourney.routes";
import missionVisionRoutes from "./missionVision.routes";
import whatWeDoRoutes from "./whatWeDo.routes";
import serviceRoutes from "./service.routes";
import collaborationRoutes from "./collaboration.routes";
import campaignRoutes from "./campaign.routes";
import productLaunchRoutes from "./productLaunch.routes";
import eventRoutes from "./event.routes";
import portfolioRoutes from "./portfolio.routes";
import mediaGalleryRoutes from "./mediaGallery.routes";
import careerRoutes from "./career.routes";
import blogRoutes from "./blog.routes";
import faqRoutes from "./faq.routes";
import contactRoutes from "./contact.routes";
import websiteSettingsRoutes from "./websiteSettings.routes";
import testimonialsPageRoutes from "./testimonialsPage.routes";
import privacyPolicyRoutes from "./privacyPolicy.routes";
import termsPolicyRoutes from "./termsPolicy.routes";
import legalRoutes from "./legal.routes";

// Import models and repositories
import { CMSData } from "../models/CMSData";
import { Service } from "../models/Service";
import { Career } from "../models/Career";
import { Blog } from "../models/Blog";
import { Faq } from "../models/FAQ";
import { Event } from "../models/Event";
import { Portfolio } from "../models/Portfolio";
import { MediaGallery } from "../models/MediaGallery";
import { MissionVision } from "../models/MissionVision";
import { Contact } from "../models/Contact";
import { WebsiteSettings } from "../models/WebsiteSettings";
import { ServicesPage } from "../models/ServicesPage";
import { TestimonialsPage } from "../models/TestimonialsPage";
import { TermsPolicy } from "../models/TermsPolicy";
import { PrivacyPolicy } from "../models/PrivacyPolicy";
import { CookiePolicy } from "../models/CookiePolicy";
import { LegalSettings } from "../models/LegalSettings";
import { About } from "../models/About";

import {
  serviceRepository,
  blogRepository,
  careerRepository,
  faqRepository,
  eventRepository,
  portfolioRepository,
  mediaGalleryRepository,
  collaborationRepository,
  campaignRepository,
  productLaunchRepository,
  contactRepository,
  websiteSettingsRepository,
  servicesPageRepository,
  missionVisionRepository,
  testimonialsPageRepository,
  termsPolicyRepository,
  privacyPolicyRepository,
  cookiePolicyRepository,
  legalSettingsRepository,
  aboutRepository,
} from "../repositories";

const router = Router();

// Public endpoint for submitting a resume/career application
const handleResumeSubmission = async (req: any, res: any, next: any) => {
  try {
    const { name, candidateName, fullName, email, phone, jobTitle, role, position, experience, portfolioLink, message, whyJoin, coverLetter } = req.body;
    const resumeId = `resume-${Date.now()}`;
    let downloadUrl = "";
    let base64Data = "";
    let publicId = "";
    
    if (req.file) {
      const origName = req.file.originalname || "resume.pdf";
      const mimeType = req.file.mimetype || "application/pdf";
      const ext = path.extname(origName) || ".pdf";
      const baseName = path.basename(origName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

      base64Data = `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;
      publicId = uniqueFileName;
      downloadUrl = `/api/v1/resumes/download?id=${resumeId}&file=${encodeURIComponent(uniqueFileName)}`;

      // Optional local filesystem backup
      try {
        const resumesDir = path.join(process.cwd(), "uploads", "resumes");
        if (!fs.existsSync(resumesDir)) {
          fs.mkdirSync(resumesDir, { recursive: true });
        }
        fs.writeFileSync(path.join(resumesDir, uniqueFileName), req.file.buffer);
      } catch (e) {}
    }

    // Append to CMSData 'resumes' and 'careerApplications' array
    const doc = await CMSData.findOne({ key: "resumes" });
    let resumes = [];
    if (doc && Array.isArray(doc.value)) {
      resumes = doc.value;
    } else {
      resumes = [];
    }

    const applicantName = name || candidateName || fullName || "Anonymous Candidate";
    const jobRole = jobTitle || role || position || "General Application";

    const newResume = {
      id: resumeId,
      name: applicantName,
      candidateName: applicantName,
      fullName: applicantName,
      email: email || "",
      phone: phone || "",
      jobTitle: jobRole,
      jobApplied: jobRole,
      position: jobRole,
      portfolioUrl: experience || portfolioLink || "",
      experience: experience || portfolioLink || "",
      message: message || whyJoin || "",
      whyJoin: message || whyJoin || "",
      coverLetter: coverLetter || "",
      resumeFileUrl: downloadUrl || "",
      resumeUrl: downloadUrl || "",
      resumeBase64Data: base64Data || "",
      resumeFileName: req.file?.originalname || 'resume.pdf',
      publicId: publicId,
      status: "New",
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    // Store sanitized resume object without heavy base64 in the main array
    const sanitizedResumeForList = { ...newResume };
    delete (sanitizedResumeForList as any).resumeBase64Data;

    resumes.unshift(sanitizedResumeForList); // Add to top

    await CMSData.findOneAndUpdate(
      { key: "resumes" },
      { value: resumes },
      { upsert: true, new: true }
    );

    await CMSData.findOneAndUpdate(
      { key: "careerApplications" },
      { value: resumes },
      { upsert: true, new: true }
    );

    ApiResponse.success(res, "Resume submitted successfully", sanitizedResumeForList);
  } catch (error) {
    next(error);
  }
};

router.post("/public/resume", parseDocument, handleResumeSubmission);
router.post("/cms/public/resume", parseDocument, handleResumeSubmission);
router.post("/public/career-application", parseDocument, handleResumeSubmission);

// GET endpoint for fetching candidate submissions (sanitized without heavy Base64 buffers)
const handleGetResumes = async (req: any, res: any, next: any) => {
  try {
    const doc = await CMSData.findOne({ key: "resumes" });
    const rawResumes = doc && Array.isArray(doc.value) ? doc.value : [];
    
    const sanitized = rawResumes.map((r: any) => {
      const { resumeBase64Data, ...rest } = r;
      return {
        ...rest,
        resumeUrl: r.resumeUrl || `/api/v1/resumes/download?id=${r.id || r._id}&file=${encodeURIComponent(r.resumeFileName || 'resume.pdf')}`
      };
    });
    
    ApiResponse.success(res, "Resumes fetched successfully", sanitized);
  } catch (error) {
    next(error);
  }
};

router.get("/resumes", handleGetResumes);
router.get("/public/resumes", handleGetResumes);
router.get("/career-applications", handleGetResumes);
router.get("/applications", handleGetResumes);

// DELETE endpoint for removing an applicant submission
const handleDeleteResume = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiResponse.error(res, "Missing applicant ID", 400);
    }
    const target = String(id).trim().toLowerCase();

    const isMatch = (r: any) => {
      if (!r) return false;
      if (r.id && String(r.id).trim().toLowerCase() === target) return true;
      if (r._id && String(r._id).trim().toLowerCase() === target) return true;
      if (r.email && String(r.email).trim().toLowerCase() === target) return true;
      if (r.name && String(r.name).trim().toLowerCase() === target) return true;
      if (r.candidateName && String(r.candidateName).trim().toLowerCase() === target) return true;
      return false;
    };

    // 1. Delete from "resumes"
    const docResumes = await CMSData.findOne({ key: "resumes" });
    if (docResumes && Array.isArray(docResumes.value)) {
      const filtered = docResumes.value.filter((r: any) => !isMatch(r));
      await CMSData.findOneAndUpdate(
        { key: "resumes" },
        { value: filtered },
        { upsert: true, new: true }
      );
    }

    // 2. Delete from "careerApplications"
    const docApps = await CMSData.findOne({ key: "careerApplications" });
    if (docApps && Array.isArray(docApps.value)) {
      const filtered = docApps.value.filter((r: any) => !isMatch(r));
      await CMSData.findOneAndUpdate(
        { key: "careerApplications" },
        { value: filtered },
        { upsert: true, new: true }
      );
    }

    // 3. Delete from "careersCMS"
    const docCMS = await CMSData.findOne({ key: "careersCMS" });
    if (docCMS && docCMS.value && typeof docCMS.value === "object") {
      const cmsObj = docCMS.value as any;
      if (Array.isArray(cmsObj.resumes)) {
        cmsObj.resumes = cmsObj.resumes.filter((r: any) => !isMatch(r));
        await CMSData.findOneAndUpdate(
          { key: "careersCMS" },
          { value: cmsObj },
          { upsert: true, new: true }
        );
      }
    }

    // 4. Delete from "careersPage"
    const docPage = await CMSData.findOne({ key: "careersPage" });
    if (docPage && docPage.value && typeof docPage.value === "object") {
      const pageObj = docPage.value as any;
      if (Array.isArray(pageObj.resumes)) {
        pageObj.resumes = pageObj.resumes.filter((r: any) => !isMatch(r));
        await CMSData.findOneAndUpdate(
          { key: "careersPage" },
          { value: pageObj },
          { upsert: true, new: true }
        );
      }
    }

    ApiResponse.success(res, "Application deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};

router.delete("/resumes/:id", handleDeleteResume);
router.delete("/public/resume/:id", handleDeleteResume);
router.delete("/career-application/:id", handleDeleteResume);
router.delete("/applications/:id", handleDeleteResume);

// Proxy & direct local file downloader for resumes (PDF, DOCX, PPT, etc.)
const handleResumeDownload = async (req: any, res: any) => {
  try {
    let rawUrl = (req.query.url as string) || (req.query.file as string) || "";
    let downloadFileName = (req.query.filename as string) || "candidate_resume.pdf";
    const id = req.query.id as string;

    // 0. Handle lookup by applicant ID first
    if (id) {
      const doc = await CMSData.findOne({ key: "resumes" });
      const resumes = doc && Array.isArray(doc.value) ? doc.value : [];
      const applicant = resumes.find((r: any) => r.id === id || r._id === id);
      if (applicant) {
        if (applicant.resumeFileName) downloadFileName = applicant.resumeFileName;
        const targetUrl = applicant.resumeBase64Data || applicant.resumeUrl || applicant.resumeFileUrl || "";
        if (targetUrl.startsWith("data:")) {
          const matches = targetUrl.match(/^data:(.*?);base64,(.*)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const buffer = Buffer.from(matches[2], "base64");
            res.setHeader("Content-Type", mimeType);
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
            return res.send(buffer);
          }
        }
        if (!rawUrl && targetUrl) rawUrl = targetUrl;
      }
    }

    if (!rawUrl) {
      return res.status(400).json({ success: false, message: "Missing resume file parameter" });
    }

    // 1. Handle Base64 Data URIs directly
    if (rawUrl.startsWith("data:")) {
      const matches = rawUrl.match(/^data:(.*?);base64,(.*)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
        return res.send(buffer);
      }
    }

    // 2. Check local uploads folder first for local resume files (/uploads/resumes/...)
    const cleanFileName = path.basename(rawUrl);
    const localPath = path.join(process.cwd(), "uploads", "resumes", cleanFileName);

    if (fs.existsSync(localPath)) {
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
      return res.sendFile(localPath);
    }

    // Also check if rawUrl has full relative path inside process.cwd()
    if (rawUrl.startsWith("/uploads/")) {
      const fullRelativePath = path.join(process.cwd(), rawUrl);
      if (fs.existsSync(fullRelativePath)) {
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
        return res.sendFile(fullRelativePath);
      }
    }

    // 3. Fallback for legacy Cloudinary resume URLs
    let response: any = null;
    try {
      response = await fetch(rawUrl);
    } catch (e) {}

    if ((!response || !response.ok) && rawUrl.includes("cloudinary.com")) {
      const fallbackCandidates: string[] = [];
      if (rawUrl.endsWith(".pdf")) {
        fallbackCandidates.push(rawUrl.slice(0, -4));
      }
      if (!rawUrl.includes(".")) {
        fallbackCandidates.push(`${rawUrl}.pdf`);
      }

      for (const altUrl of fallbackCandidates) {
        try {
          const altResp = await fetch(altUrl);
          if (altResp.ok) {
            response = altResp;
            break;
          }
        } catch (e) {}
      }
    }

    if (response && response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get("content-type") || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
      return res.send(buffer);
    }

    return res.status(404).json({ success: false, message: "Resume file not found on server storage" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

router.get("/resumes/download", handleResumeDownload);
router.get("/public/resumes/download", handleResumeDownload);
router.get("/api/v1/resumes/download", handleResumeDownload);
router.get("/cms/resumes/download", handleResumeDownload);

// Public endpoint for submitting a business inquiry / contact form submission
const handleEnquirySubmission = async (req: any, res: any, next: any) => {
  try {
    const { name, candidateName, email, phone, company, brand, category, subject, message, outline } = req.body;
    
    const doc = await CMSData.findOne({ key: "contactEnquiries" });
    let enquiries = [];
    if (doc && Array.isArray(doc.value)) {
      enquiries = doc.value;
    } else {
      enquiries = [];
    }

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name: name || candidateName || "Anonymous Lead",
      email: email || "",
      phone: phone || "",
      company: company || brand || "",
      category: category || subject || "Business Inquiry",
      subject: category || subject || "Business Inquiry",
      message: message || outline || "",
      date: new Date().toISOString().split('T')[0],
      status: "New",
      createdAt: new Date().toISOString()
    };

    enquiries.unshift(newEnquiry);

    await CMSData.findOneAndUpdate(
      { key: "contactEnquiries" },
      { value: enquiries },
      { upsert: true, new: true }
    );
    
    await CMSData.findOneAndUpdate(
      { key: "enquiries" },
      { value: enquiries },
      { upsert: true, new: true }
    );

    ApiResponse.success(res, "Inquiry submitted successfully", newEnquiry);
  } catch (error) {
    next(error);
  }
};

router.post("/public/enquiry", handleEnquirySubmission);
router.post("/public/contact", handleEnquirySubmission);
router.post("/enquiry", handleEnquirySubmission);

// Aggregate endpoint for the public frontends
router.get("/", async (req, res, next) => {
  try {
    // 1. Fetch all CMSData generic key-value documents (excluding heavy applicant submission arrays)
    const cmsDocs = await CMSData.find({ key: { $nin: ["resumes", "careerApplications", "contactEnquiries", "enquiries"] } });
    const cmsDataMap: Record<string, any> = {};
    for (const doc of cmsDocs) {
      cmsDataMap[doc.key] = doc.value;
    }

    // 2. Fetch all collections in parallel for fallback
    const [
      services,
      blogs,
      careers,
      faqs,
      events,
      portfolio,
      mediaGallery,
      collaborations,
      campaigns,
      productLaunches,
      contact,
      websiteSettings,
      servicesPage,
      missionVision,
      testimonialsPage,
      termsPolicy,
      privacyPolicy,
      cookiePolicy,
      legalSettings,
      aboutDocs
    ] = await Promise.all([
      serviceRepository.find(),
      blogRepository.find(),
      careerRepository.find(),
      faqRepository.find(),
      eventRepository.find(),
      portfolioRepository.find(),
      mediaGalleryRepository.find(),
      collaborationRepository.find(),
      campaignRepository.find(),
      productLaunchRepository.find(),
      contactRepository.find(),
      websiteSettingsRepository.find(),
      servicesPageRepository.find(),
      missionVisionRepository.find(),
      testimonialsPageRepository.find(),
      termsPolicyRepository.find(),
      privacyPolicyRepository.find(),
      cookiePolicyRepository.find(),
      legalSettingsRepository.find(),
      aboutRepository.find()
    ]);

    // 3. Construct aggregated CMS state
    const data: Record<string, any> = {
      services,
      blogs,
      careers,
      faqs,
      events,
      portfolio,
      mediaGallery,
      collaborations,
      campaigns,
      productLaunches,
      contact: contact[0] || null,
      websiteSettings: websiteSettings[0] || null,
      servicesPage: servicesPage[0] || null,
      missionVision: cmsDataMap['missionVision'] || missionVision[0] || null,
      testimonialsPage: testimonialsPage[0] || null,
      termsPolicy: cmsDataMap['termsPolicy'] || cmsDataMap['termsPolicyData'] || termsPolicy[0] || null,
      privacyPolicy: cmsDataMap['privacyPolicy'] || cmsDataMap['privacyPolicyData'] || privacyPolicy[0] || null,
      cookiePolicy: cookiePolicy[0] || null,
      legalSettings: legalSettings[0] || null,
      about: cmsDataMap['about'] || aboutDocs[0] || null,
      whatWeDo: cmsDataMap['whatWeDo'] || cmsDataMap['what_we_do'] || cmsDataMap['whatWeDoData'] || null,
      collaborationsPage: cmsDataMap['collaborationsPage'] || cmsDataMap['collaborationsCMS'] || cmsDataMap['collaborations'] || null,
      campaignsPage: cmsDataMap['campaignsPage'] || cmsDataMap['campaignsCMS'] || cmsDataMap['campaignsData'] || cmsDataMap['campaigns'] || null,
      launchesData: cmsDataMap['launchesData'] || cmsDataMap['productLaunchesCMS'] || cmsDataMap['productLaunches'] || null,
      eventsData_CMS: cmsDataMap['eventsData_CMS'] || cmsDataMap['eventsCMS'] || cmsDataMap['eventsPage'] || null,
      portfolioCMS: cmsDataMap['portfolioCMS'] || cmsDataMap['portfolioPage'] || cmsDataMap['ourWork'] || null,
      homepageCMS: cmsDataMap['homepageCMS'] || cmsDataMap['homepage'] || cmsDataMap['homeData'] || null,
      founderJourney: cmsDataMap['founderJourney'] || cmsDataMap['founder_journey'] || null,
      servicesCMS: cmsDataMap['servicesCMS'] || cmsDataMap['servicesPageData'] || cmsDataMap['coreServices'] || null,
      testimonialsCMS: cmsDataMap['testimonialsCMS'] || cmsDataMap['testimonialsPageData'] || cmsDataMap['testimonials'] || null,
      faqPageData: cmsDataMap['faqPageData'] || cmsDataMap['faqs'] || null,
      contactPageData: cmsDataMap['contactPageData'] || cmsDataMap['contactInfo'] || cmsDataMap['contact'] || null,
      footer: cmsDataMap['footer'] || null,
      ...cmsDataMap, // Dynamically override and inject any updated flat keys
    };

    // 4. Attach sanitized resumes/applications and enquiries (without Base64 bloat)
    const resumesDoc = await CMSData.findOne({ key: "resumes" });
    const rawResumes = resumesDoc && Array.isArray(resumesDoc.value) ? resumesDoc.value : [];
    const sanitizedResumes = rawResumes.map((r: any) => {
      const { resumeBase64Data, ...rest } = r;
      return {
        ...rest,
        resumeUrl: r.resumeUrl || `/api/v1/resumes/download?id=${r.id || r._id}&file=${encodeURIComponent(r.resumeFileName || 'resume.pdf')}`
      };
    });

    const enquiriesDoc = await CMSData.findOne({ key: "contactEnquiries" });
    const rawEnquiries = enquiriesDoc && Array.isArray(enquiriesDoc.value) ? enquiriesDoc.value : [];
    const sanitizedEnquiries = rawEnquiries.map((e: any) => ({ ...e }));

    data.resumes = sanitizedResumes;
    data.careerApplications = sanitizedResumes;
    data.contactEnquiries = sanitizedEnquiries;
    data.enquiries = sanitizedEnquiries;

    ApiResponse.success(res, "CMS aggregate data retrieved successfully", data);
  } catch (error) {
    next(error);
  }
});

// GET Featured Videos compatibility route for client website
router.get("/featured-videos", async (req: any, res: any, next: any) => {
  try {
    const cmsDoc = await CMSData.findOne({ key: "featuredVideos" });
    ApiResponse.success(res, "Featured videos retrieved successfully", cmsDoc ? cmsDoc.value : []);
  } catch (err) {
    next(err);
  }
});

// Section state update synchronizer endpoint for Admin Dashboard
router.post("/update", authenticate as any, async (req: any, res: any, next: any) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      ApiResponse.error(res, "Missing key parameter", 400);
      return;
    }

    // 1. Update CMSData key-value collection
    const doc = await CMSData.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    // 2. Sync to structured model if it's a known collection
    const ModelMap: Record<string, any> = {
      services: Service,
      careers: Career,
      blogs: Blog,
      faqs: Faq,
      events: Event,
      portfolio: Portfolio,
      mediaGallery: MediaGallery,
      missionVision: MissionVision,
      contact: Contact,
      websiteSettings: WebsiteSettings,
      servicesPage: ServicesPage,
      testimonialsPage: TestimonialsPage,
      termsPolicy: TermsPolicy,
      privacyPolicy: PrivacyPolicy,
      cookiePolicy: CookiePolicy,
      legalSettings: LegalSettings,
      about: About,
    };

    if (ModelMap[key]) {
      const Model = ModelMap[key];
      try {
        await Model.deleteMany({});
        
        if (Array.isArray(value)) {
          const payloadArray = value;
          const usedSlugs = new Set<string>();

          const recordsToInsert = payloadArray.map((item: any, idx: number) => {
            const cleanItem = { ...item };
            if (cleanItem.id && /^[0-9a-fA-F]{24}$/.test(cleanItem.id)) {
              cleanItem._id = cleanItem.id;
            }
            
            const rawSlugSource = cleanItem.slug || cleanItem.title || cleanItem.role || cleanItem.name || cleanItem.productName || `item-${idx + 1}`;
            const baseSlug = String(rawSlugSource)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '') || `item-${Date.now()}`;

            let finalSlug = baseSlug;
            let counter = 1;
            while (usedSlugs.has(finalSlug)) {
              finalSlug = `${baseSlug}-${counter}`;
              counter++;
            }
            usedSlugs.add(finalSlug);
            cleanItem.slug = finalSlug;

            if (!cleanItem.title) cleanItem.title = cleanItem.role || cleanItem.name || cleanItem.productName || "Untitled";
            if (!cleanItem.category) cleanItem.category = "General";
            if (!cleanItem.description) cleanItem.description = "";
            return cleanItem;
          });

          if (recordsToInsert.length > 0) {
            await Model.insertMany(recordsToInsert, { ordered: false });
          }
        } else if (value && typeof value === 'object') {
          const cleanItem = { ...value };
          if (cleanItem.id && /^[0-9a-fA-F]{24}$/.test(cleanItem.id)) {
            cleanItem._id = cleanItem.id;
          }
          const rawSlugSource = cleanItem.slug || cleanItem.title || cleanItem.name || cleanItem.productName || key;
          cleanItem.slug = String(rawSlugSource)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || `${key}-${Date.now()}`;

          if (!cleanItem.title) cleanItem.title = cleanItem.name || cleanItem.productName || key;
          if (!cleanItem.category) cleanItem.category = "General";
          if (!cleanItem.description) cleanItem.description = "";
          await Model.create(cleanItem);
        }
      } catch (err) {
        console.warn(`Structured model sync warning for ${key}:`, err);
      }
    }

    ApiResponse.success(res, `${key} synchronized successfully`, doc);
  } catch (error) {
    next(error);
  }
});

// Mount all CMS sub-routers with both kebab-case and camelCase aliases for 100% API compatibility
router.use("/homepage", homepageRoutes);
router.use("/home", homepageRoutes);
router.use("/home-page", homepageRoutes);
router.use("/homePage", homepageRoutes);
router.use("/about", aboutRoutes);
router.use("/founder-journey", founderJourneyRoutes);
router.use("/founderJourney", founderJourneyRoutes);
router.use("/journey", founderJourneyRoutes);
router.use("/mission-vision", missionVisionRoutes);
router.use("/missionVision", missionVisionRoutes);
router.use("/what-we-do", whatWeDoRoutes);
router.use("/whatWeDo", whatWeDoRoutes);
router.use("/services", serviceRoutes);
router.use("/core-services", serviceRoutes);
router.use("/coreServices", serviceRoutes);
router.use("/collaborations", collaborationRoutes);
router.use("/collaborations-page", collaborationRoutes);
router.use("/collaborationsPage", collaborationRoutes);
router.use("/brand-collaborations", collaborationRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/campaigns-page", campaignRoutes);
router.use("/campaignsPage", campaignRoutes);
router.use("/product-launches", productLaunchRoutes);
router.use("/productLaunches", productLaunchRoutes);
router.use("/product-launch", productLaunchRoutes);
router.use("/launches", productLaunchRoutes);
router.use("/events", eventRoutes);
router.use("/events-page", eventRoutes);
router.use("/eventsPage", eventRoutes);
router.use("/talks", eventRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/our-work", portfolioRoutes);
router.use("/ourWork", portfolioRoutes);
router.use("/work", portfolioRoutes);
router.use("/media-gallery", mediaGalleryRoutes);
router.use("/mediaGallery", mediaGalleryRoutes);
router.use("/careers", careerRoutes);
router.use("/blogs", blogRoutes);
router.use("/blog", blogRoutes);
router.use("/faqs", faqRoutes);
router.use("/faq", faqRoutes);
router.use("/faq-page", faqRoutes);
router.use("/faqPage", faqRoutes);
router.use("/contact", contactRoutes);
router.use("/contact-page", contactRoutes);
router.use("/contactPage", contactRoutes);
router.use("/website-settings", websiteSettingsRoutes);
router.use("/websiteSettings", websiteSettingsRoutes);
router.use("/testimonials-page", testimonialsPageRoutes);
router.use("/testimonialsPage", testimonialsPageRoutes);
router.use("/testimonials", testimonialsPageRoutes);
router.use("/testimonial", testimonialsPageRoutes);
router.use("/privacy-policy", privacyPolicyRoutes);
router.use("/privacyPolicy", privacyPolicyRoutes);
router.use("/privacy", privacyPolicyRoutes);
router.use("/terms-of-service", termsPolicyRoutes);
router.use("/termsOfService", termsPolicyRoutes);
router.use("/terms-and-conditions", termsPolicyRoutes);
router.use("/termsConditions", termsPolicyRoutes);
router.use("/terms", termsPolicyRoutes);
router.use("/legal", legalRoutes);
router.use("/legal-settings", legalRoutes);
router.use("/legalSettings", legalRoutes);

export default router;
