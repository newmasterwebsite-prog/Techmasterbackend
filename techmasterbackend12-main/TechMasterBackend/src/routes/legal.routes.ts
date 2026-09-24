import { Router } from "express";
import { TermsPolicy } from "../models/TermsPolicy";
import { PrivacyPolicy } from "../models/PrivacyPolicy";
import { CookiePolicy } from "../models/CookiePolicy";
import { LegalSettings } from "../models/LegalSettings";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";

const router = Router();

// TERMS OF SERVICE
router.get("/terms", async (req, res, next) => {
  try {
    let doc = await TermsPolicy.findOne({});
    if (!doc) {
      doc = await TermsPolicy.create({
        popupTitle: "Terms of Service",
        effectiveDate: "July 7, 2026",
        smallBadge: "LEGAL PROTOCOLS",
        subtitle: "TechMaster Terms",
        introParagraph: "By browsing this platform, subscribing to our mailing list, or submitting inquiries, you agree to these Terms of Service.",
        sections: [
          { title: "Intellectual Property", body: "All site designs, 3D shaders, systems blueprints, and video snippets are the trademark properties of Aman and Tech Master Labs unless stated otherwise.", order: 1, status: "Active" },
          { title: "User License", body: "You are granted a limited license to explore our portfolio and code projects for educational research. Scraping, cloning, or distributing source codes commercially without express written consent is strictly prohibited.", order: 2, status: "Active" },
          { title: "Sandbox Declarations", body: "All forms, databases, and estimates operate in safe sandbox demonstration pipelines.", order: 3, status: "Active" }
        ]
      });
    }
    ApiResponse.success(res, "Terms of Service retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

router.put("/terms", authenticate as any, async (req, res, next) => {
  try {
    const doc = await TermsPolicy.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    ApiResponse.success(res, "Terms of Service updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

// PRIVACY POLICY
router.get("/privacy", async (req, res, next) => {
  try {
    let doc = await PrivacyPolicy.findOne({});
    if (!doc) {
      doc = await PrivacyPolicy.create({
        popupTitle: "Privacy Policy",
        effectiveDate: "July 7, 2026",
        smallBadge: "USER PRIVACY",
        introParagraph: "Aman & Tech Master Media Labs operates this portfolio and education portal. We respect your privacy and only collect direct email addresses when you subscribe to our newsletter.",
        sections: [
          { heading: "Data Collection & Use", description: "We collect email addresses solely for sending newsletter digests, cohort details, and technical blogs. Your information is never sold, traded, or shared with third-party advertising companies.", order: 1, status: "Active" },
          { heading: "Cookies", description: "This platform utilizes basic localized storage and caching systems to maintain animations, 3D settings, and user navigation states smoothly.", order: 2, status: "Active" },
          { heading: "Security", description: "All direct inquiries and newsletter transmissions are protected with industry-standard cryptographic handshakes.", order: 3, status: "Active" }
        ]
      });
    }
    ApiResponse.success(res, "Privacy Policy retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

router.put("/privacy", authenticate as any, async (req, res, next) => {
  try {
    const doc = await PrivacyPolicy.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    ApiResponse.success(res, "Privacy Policy updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

// COOKIE POLICY
router.get("/cookies", async (req, res, next) => {
  try {
    let doc = await CookiePolicy.findOne({});
    if (!doc) {
      doc = await CookiePolicy.create({
        title: "Cookie Policy",
        effectiveDate: "July 7, 2026",
        description: "We use cookies to personalize content and analyze traffic.",
        categories: [
          { name: "Necessary", description: "Required for core system security and layout features.", order: 1, status: "Active" },
          { name: "Analytics", description: "Help us understand traffic channels and tutorial view loops.", order: 2, status: "Active" }
        ]
      });
    }
    ApiResponse.success(res, "Cookie Policy retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

router.put("/cookies", authenticate as any, async (req, res, next) => {
  try {
    const doc = await CookiePolicy.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    ApiResponse.success(res, "Cookie Policy updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

// LEGAL SETTINGS
router.get("/settings", async (req, res, next) => {
  try {
    let doc = await LegalSettings.findOne({});
    if (!doc) {
      doc = await LegalSettings.create({
        showTerms: true,
        showPrivacy: true,
        showCookiePolicy: true,
        enablePopup: true,
        popupAnimation: "fade",
        blurBackground: true,
        closeOnOutsideClick: true,
        showLastUpdated: true,
        popupWidth: "max-w-2xl",
        theme: "dark",
        overlayOpacity: 80,
      });
    }
    ApiResponse.success(res, "Legal Settings retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

router.put("/settings", authenticate as any, async (req, res, next) => {
  try {
    const doc = await LegalSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    ApiResponse.success(res, "Legal Settings updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

export default router;
