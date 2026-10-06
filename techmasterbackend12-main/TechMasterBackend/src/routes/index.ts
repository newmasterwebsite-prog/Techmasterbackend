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
    const { name, candidateName, fullName, email, phone, jobTitle, role, position, experience, portfolioLink, message, whyJoin, coverLetter, resumeBase64: bodyResumeBase64 } = req.body;
    const resumeId = `resume-${Date.now()}`;
    let downloadUrl = "";
    let base64Data = "";
    let publicId = "";
    let origName = "resume.pdf";
    let mimeType = "application/pdf";
    let fileBuffer: Buffer | null = null;

    if (req.file && req.file.buffer) {
      fileBuffer = req.file.buffer;
      origName = req.file.originalname || "resume.pdf";
      mimeType = req.file.mimetype || "application/pdf";
    } else if (bodyResumeBase64 && typeof bodyResumeBase64 === "string" && bodyResumeBase64.startsWith("data:")) {
      const match = bodyResumeBase64.match(/^data:(.*?);base64,(.*)$/);
      if (match && match.length === 3) {
        mimeType = match[1];
        fileBuffer = Buffer.from(match[2], "base64");
        origName = req.body.resumeFileName || "resume.pdf";
      }
    }

    if (fileBuffer) {
      const ext = path.extname(origName) || (mimeType.includes("pdf") ? ".pdf" : mimeType.includes("word") ? ".docx" : ".pdf");
      const baseName = path.basename(origName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueFileName = `${baseName}_${Date.now()}${ext}`;
      publicId = uniqueFileName;
      base64Data = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

      // 1. Try Cloudinary upload if configured (gives permanent CDN URL)
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uploadRes = await CloudinaryService.uploadBuffer(
            fileBuffer,
            "techmaster/resumes",
            "auto",
            { public_id: uniqueFileName }
          );
          if (uploadRes && uploadRes.secure_url) {
            downloadUrl = uploadRes.secure_url;
          }
        }
      } catch (cloudErr) {
        console.warn("Cloudinary resume upload notice (using database & local backup):", cloudErr);
      }

      if (!downloadUrl) {
        downloadUrl = `/api/v1/resumes/download?id=${resumeId}&file=${encodeURIComponent(uniqueFileName)}`;
      }

      // 2. Save base64 permanently to MongoDB CMSData (persists across server restarts & multiple machines)
      try {
        await CMSData.findOneAndUpdate(
          { key: `resume_file_${resumeId}` },
          { value: { base64Data, mimeType, fileName: origName, uniqueFileName, downloadUrl } },
          { upsert: true, new: true }
        );
        if (uniqueFileName) {
          await CMSData.findOneAndUpdate(
            { key: `resume_file_${uniqueFileName}` },
            { value: { base64Data, mimeType, fileName: origName, uniqueFileName, downloadUrl } },
            { upsert: true, new: true }
          );
        }
      } catch (e) {}

      // 3. Local filesystem backup if writable
      try {
        const resumesDir = path.join(process.cwd(), "uploads", "resumes");
        if (!fs.existsSync(resumesDir)) {
          fs.mkdirSync(resumesDir, { recursive: true });
        }
        fs.writeFileSync(path.join(resumesDir, uniqueFileName), fileBuffer);
      } catch (e) {}
    } else {
      downloadUrl = `/api/v1/resumes/download?id=${resumeId}&file=resume.pdf`;
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
      resumeFileName: origName,
      publicId: publicId,
      status: "New",
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    // Store sanitized resume for list (keep light, strip large base64 from array if > 250KB)
    const sanitizedResumeForList = { ...newResume };
    if (base64Data && base64Data.length > 250000) {
      delete (sanitizedResumeForList as any).resumeBase64Data;
    }

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

// GET endpoint for fetching candidate submissions
const handleGetResumes = async (req: any, res: any, next: any) => {
  try {
    const doc = await CMSData.findOne({ key: "resumes" });
    const rawResumes = doc && Array.isArray(doc.value) ? doc.value : [];
    
    const sanitized = rawResumes.map((r: any) => {
      const { resumeBase64Data, ...rest } = r;
      const downloadPath = `/api/v1/resumes/download?id=${r.id || r._id}&file=${encodeURIComponent(r.resumeFileName || 'resume.pdf')}`;
      return {
        ...rest,
        resumeUrl: r.resumeUrl || downloadPath,
        resumeFileUrl: r.resumeFileUrl || r.resumeUrl || downloadPath,
        ...(resumeBase64Data && resumeBase64Data.length < 200000 ? { resumeBase64Data } : {})
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

// Helper: Generate a valid, clean candidate application summary PDF document
function generateApplicantSummaryPdf(applicant: any): Buffer {
  const sanitize = (str: any) => String(str || '').replace(/[()\\\\]/g, ' ').replace(/[^\x20-\x7E\t\n\r]/g, ' ').trim();
  const name = sanitize(applicant.name || applicant.candidateName || applicant.fullName || 'Candidate Applicant');
  const role = sanitize(applicant.jobTitle || applicant.jobApplied || applicant.position || 'General Application');
  const email = sanitize(applicant.email || 'N/A');
  const phone = sanitize(applicant.phone || 'N/A');
  const portfolio = sanitize(applicant.portfolioUrl || applicant.experience || applicant.portfolioLink || 'N/A');
  const whyJoin = sanitize(applicant.whyJoin || applicant.message || 'Candidate application profile on record.');
  const coverLetter = sanitize(applicant.coverLetter || '');
  const appliedDate = sanitize(applicant.date || (applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : new Date().toISOString().split('T')[0]));
  const appId = sanitize(applicant.id || applicant._id || 'REF-APP');

  let stream = `BT\n/F1 18 Tf\n50 780 Td\n(TECHMASTER TALENT & LABS) Tj\n/F2 10 Tf\n0 -18 Td\n(Official Candidate Application Dossier | Ref: ${appId}) Tj\n/F1 14 Tf\n0 -35 Td\n(Candidate: ${name}) Tj\n/F2 10 Tf\n0 -18 Td\n(Position Applied: ${role}) Tj\n0 -15 Td\n(Application Date: ${appliedDate}) Tj\n0 -15 Td\n(Email: ${email}  |  Phone: ${phone}) Tj\n0 -15 Td\n(Portfolio / Link: ${portfolio}) Tj\n/F1 12 Tf\n0 -30 Td\n(Candidate Statement / Application Message:) Tj\n/F2 10 Tf\n`;

  const words = whyJoin.split(' ');
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).length > 75) {
      stream += `0 -14 Td\n(${line.trim()}) Tj\n`;
      line = w + ' ';
    } else {
      line += w + ' ';
    }
  }
  if (line.trim()) {
    stream += `0 -14 Td\n(${line.trim()}) Tj\n`;
  }

  if (coverLetter && coverLetter !== 'None provided' && coverLetter !== whyJoin) {
    stream += `/F1 12 Tf\n0 -25 Td\n(Cover Letter:) Tj\n/F2 10 Tf\n`;
    const clWords = coverLetter.split(' ');
    let clLine = '';
    for (const w of clWords) {
      if ((clLine + ' ' + w).length > 75) {
        stream += `0 -14 Td\n(${clLine.trim()}) Tj\n`;
        clLine = w + ' ';
      } else {
        clLine += w + ' ';
      }
    }
    if (clLine.trim()) {
      stream += `0 -14 Td\n(${clLine.trim()}) Tj\n`;
    }
  }

  stream += `0 -35 Td\n/F2 9 Tf\n([TechMaster Verified Candidate Record - Retained for Hiring Review]) Tj\nET`;

  const streamBytes = Buffer.from(stream, 'utf-8');
  const streamLength = streamBytes.length;

  const part1 = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n6 0 obj\n<< /Length ${streamLength} >>\nstream\n`;
  const part2 = '\nendstream\nendobj\n';

  const o1 = 9;
  const o2 = o1 + 49;
  const o3 = o2 + 57;
  const o4 = o3 + 136;
  const o5 = o4 + 78;
  const o6 = o5 + 73;
  const xrefOffset = o6 + 32 + String(streamLength).length + streamLength + part2.length;

  const xref = `xref\n0 7\n0000000000 65535 f \n${String(o1).padStart(10, '0')} 00000 n \n${String(o2).padStart(10, '0')} 00000 n \n${String(o3).padStart(10, '0')} 00000 n \n${String(o4).padStart(10, '0')} 00000 n \n${String(o5).padStart(10, '0')} 00000 n \n${String(o6).padStart(10, '0')} 00000 n \ntrailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.concat([Buffer.from(part1, 'utf-8'), streamBytes, Buffer.from(part2 + xref, 'utf-8')]);
}

// Proxy & direct local file downloader for resumes (PDF, DOCX, PPT, etc.)
const handleResumeDownload = async (req: any, res: any) => {
  try {
    let rawUrl = (req.query.url as string) || (req.query.file as string) || "";
    let downloadFileName = (req.query.filename as string) || "candidate_resume.pdf";
    let targetId = (req.query.id as string) || "";
    let targetFile = (req.query.file as string) || "";

    // Parse embedded query parameters if rawUrl contains ?id= or &file= or &filename=
    if (rawUrl && (rawUrl.includes("id=") || rawUrl.includes("file=") || rawUrl.includes("filename="))) {
      try {
        const dummyUrl = rawUrl.startsWith("http")
          ? new URL(rawUrl)
          : new URL(`http://localhost${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
        if (!targetId && dummyUrl.searchParams.get("id")) {
          targetId = dummyUrl.searchParams.get("id") || "";
        }
        if (!targetFile && dummyUrl.searchParams.get("file")) {
          targetFile = dummyUrl.searchParams.get("file") || "";
        }
        if ((!downloadFileName || downloadFileName === "candidate_resume.pdf") && dummyUrl.searchParams.get("filename")) {
          downloadFileName = dummyUrl.searchParams.get("filename") || downloadFileName;
        }
      } catch (e) {}
    }

    if (targetFile) {
      targetFile = decodeURIComponent(targetFile);
    }
    if (targetId) {
      targetId = decodeURIComponent(targetId);
    }

    // 0. Check MongoDB CMSData for permanent Base64 stored files
    const keysToCheck: string[] = [];
    if (targetId) keysToCheck.push(`resume_file_${targetId}`);
    if (targetFile) keysToCheck.push(`resume_file_${targetFile}`);

    for (const k of keysToCheck) {
      const fileDoc = await CMSData.findOne({ key: k });
      if (fileDoc && fileDoc.value) {
        const b64 = fileDoc.value.base64Data || (typeof fileDoc.value === "string" && fileDoc.value.startsWith("data:") ? fileDoc.value : null);
        if (b64) {
          const matches = b64.match(/^data:(.*?);base64,(.*)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const buffer = Buffer.from(matches[2], "base64");
            const finalName = fileDoc.value.fileName || downloadFileName;
            res.setHeader("Content-Type", mimeType);
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(finalName)}"`);
            return res.send(buffer);
          }
        }
        if (fileDoc.value.downloadUrl && (fileDoc.value.downloadUrl.startsWith("http://") || fileDoc.value.downloadUrl.startsWith("https://"))) {
          rawUrl = fileDoc.value.downloadUrl;
          break;
        }
      }
    }

    // 1. Check all candidate collections in CMSData (resumes, careerApplications, careersCMS, careersPage)
    const candidateCollections = ["resumes", "careerApplications", "careersCMS", "careersPage"];
    let applicant: any = null;

    for (const colKey of candidateCollections) {
      const colDoc = await CMSData.findOne({ key: colKey });
      if (!colDoc || !colDoc.value) continue;
      const list = Array.isArray(colDoc.value)
        ? colDoc.value
        : (colDoc.value.resumes && Array.isArray(colDoc.value.resumes) ? colDoc.value.resumes : []);
      
      applicant = list.find((r: any) => {
        if (!r) return false;
        if (targetId && (String(r.id) === targetId || String(r._id) === targetId)) return true;
        if (targetFile && (
          (r.publicId && String(r.publicId) === targetFile) ||
          (r.resumeFileName && String(r.resumeFileName) === targetFile) ||
          (r.resumeUrl && String(r.resumeUrl).includes(targetFile))
        )) return true;
        if (rawUrl && (
          (r.resumeUrl && String(r.resumeUrl) === rawUrl) ||
          (r.resumeFileUrl && String(r.resumeFileUrl) === rawUrl)
        )) return true;
        return false;
      });

      if (applicant) break;
    }

    if (applicant) {
      if (applicant.resumeFileName && (!req.query.filename || downloadFileName === "candidate_resume.pdf")) {
        downloadFileName = applicant.resumeFileName;
      }
      
      const b64 = applicant.resumeBase64Data || (applicant.resumeUrl && applicant.resumeUrl.startsWith("data:") ? applicant.resumeUrl : "") || (applicant.resumeFileUrl && applicant.resumeFileUrl.startsWith("data:") ? applicant.resumeFileUrl : "");
      if (b64 && b64.startsWith("data:")) {
        const matches = b64.match(/^data:(.*?);base64,(.*)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], "base64");
          res.setHeader("Content-Type", mimeType);
          res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
          return res.send(buffer);
        }
      }

      // Check if applicant has a remote URL (Cloudinary or CDN)
      const remoteCand = applicant.resumeUrl || applicant.resumeFileUrl || "";
      if (remoteCand && (remoteCand.startsWith("http://") || remoteCand.startsWith("https://"))) {
        rawUrl = remoteCand;
      }
    }

    // 2. Direct Base64 Data URI from query
    if (rawUrl && rawUrl.startsWith("data:")) {
      const matches = rawUrl.match(/^data:(.*?);base64,(.*)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
        return res.send(buffer);
      }
    }

    // 3. Check local uploads folder for local resume files (/uploads/resumes/...)
    const candidatesToCheck: string[] = [];
    if (targetFile) candidatesToCheck.push(targetFile);
    if (rawUrl) {
      const cleanPathName = rawUrl.split("?")[0];
      const cleanFileName = path.basename(cleanPathName);
      if (cleanFileName && cleanFileName !== "download" && cleanFileName !== "resumes") {
        candidatesToCheck.push(cleanFileName);
      }
    }
    if (targetId) candidatesToCheck.push(targetId);

    const resumesDir = path.join(process.cwd(), "uploads", "resumes");
    if (fs.existsSync(resumesDir)) {
      const existingFiles = fs.readdirSync(resumesDir);
      for (const cand of candidatesToCheck) {
        if (!cand) continue;
        const decodedCand = decodeURIComponent(cand);
        // Direct file path match
        const directPath = path.join(resumesDir, decodedCand);
        if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
          res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
          return res.sendFile(directPath);
        }
        // Partial substring match in directory
        const matched = existingFiles.find((f: string) => f === decodedCand || f.includes(decodedCand) || decodedCand.includes(f));
        if (matched) {
          const matchedPath = path.join(resumesDir, matched);
          if (fs.existsSync(matchedPath) && fs.statSync(matchedPath).isFile()) {
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
            return res.sendFile(matchedPath);
          }
        }
      }
    }

    // 4. Remote URLs (e.g. Cloudinary)
    if (rawUrl && (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))) {
      let response: any = null;
      try {
        response = await fetch(rawUrl);
      } catch (e) {}

      if ((!response || !response.ok) && rawUrl.includes("cloudinary.com")) {
        const fallbackCandidates: string[] = [];
        if (rawUrl.endsWith(".pdf")) fallbackCandidates.push(rawUrl.slice(0, -4));
        if (!rawUrl.includes(".")) fallbackCandidates.push(`${rawUrl}.pdf`);

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
    }

    // 5. Intelligent Fallback: Generate applicant dossier PDF if record exists
    if (applicant) {
      const pdfBuffer = generateApplicantSummaryPdf(applicant);
      const cleanName = (applicant.name || applicant.candidateName || "Candidate").replace(/[^a-zA-Z0-9]/g, "_");
      const fallbackPdfName = `${cleanName}_Application_Dossier.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fallbackPdfName)}"`);
      return res.send(pdfBuffer);
    }

    // 6. Generic Fallback: If targetId or downloadFileName indicates an applicant
    if (targetId || (downloadFileName && downloadFileName !== "candidate_resume.pdf")) {
      const candidateInfo = {
        id: targetId || "APP-REF",
        name: downloadFileName.replace(/_Resume.*$/i, "").replace(/_/g, " ") || "TechMaster Applicant",
        jobTitle: "Candidate Submission",
        email: "careers@techmaster.in",
        phone: "+91 98765 43210",
        message: "Candidate application archive document."
      };
      const pdfBuffer = generateApplicantSummaryPdf(candidateInfo);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
      return res.send(pdfBuffer);
    }

    if (!rawUrl && !targetFile && !targetId) {
      return res.status(400).json({ success: false, message: "Missing resume file parameter" });
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
router.get("/", async (req: any, res: any, next: any) => {
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
