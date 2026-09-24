import { Router } from "express";
import { PrivacyPolicy } from "../models/PrivacyPolicy";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { privacyPolicyController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultPrivacyData = {
  smallBadge: "USER PRIVACY",
  popupTitle: "Privacy Policy",
  effectiveDate: "July 7, 2026",
  lastUpdatedDate: "July 7, 2026",
  versionNumber: "v2.4",
  autoUpdateDate: false,
  introParagraph: "Aman & Tech Master Media Labs operates this portfolio and education portal. We respect your privacy and only collect direct email addresses when you subscribe to our newsletter.",
  visibility: true,
  sections: [
    {
      id: "sec-1",
      heading: "Data Collection & Use",
      description: "We collect email addresses solely for sending newsletter digests, cohort details, and technical blogs. Your information is never sold, traded, or shared with third-party advertising companies.",
      order: 1,
      status: "Active"
    },
    {
      id: "sec-2",
      heading: "Cookies",
      description: "This platform utilizes basic localized storage and caching systems to maintain animations, 3D settings, and user navigation states smoothly.",
      order: 2,
      status: "Active"
    },
    {
      id: "sec-3",
      heading: "Security",
      description: "All direct inquiries and newsletter transmissions are protected with industry-standard cryptographic handshakes.",
      order: 3,
      status: "Active"
    }
  ]
};

// GET Privacy Policy Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "privacyPolicy" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "privacyPolicy", value: defaultPrivacyData });
    }
    ApiResponse.success(res, "Privacy policy data retrieved successfully", cmsDoc.value || defaultPrivacyData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Privacy Policy Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "privacyPolicy" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "privacyPolicyData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "privacy" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await PrivacyPolicy.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("PrivacyPolicy model sync warning:", e);
    }

    ApiResponse.success(res, "Privacy policy updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
if (privacyPolicyController) {
  const standardCmsRouter = createCmsRouter(privacyPolicyController);
  router.use("/", standardCmsRouter);
}

export default router;
