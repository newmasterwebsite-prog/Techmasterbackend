import { Router } from "express";
import { TermsPolicy } from "../models/TermsPolicy";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { termsPolicyController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultTermsData = {
  smallBadge: "LEGAL PROTOCOLS",
  popupTitle: "Terms of Service",
  effectiveDate: "July 7, 2026",
  lastUpdatedDate: "July 7, 2026",
  versionNumber: "v3.1",
  autoUpdateDate: false,
  introParagraph: "By browsing this platform, subscribing to our mailing list, or submitting inquiries, you agree to these Terms of Service.",
  visibility: true,
  sections: [
    {
      id: "sec-1",
      title: "Intellectual Property",
      body: "All site designs, 3D shaders, systems blueprints, and video snippets are the trademark properties of Aman and Tech Master Labs unless stated otherwise.",
      order: 1,
      status: "Active"
    },
    {
      id: "sec-2",
      title: "User License",
      body: "You are granted a limited license to explore our portfolio and code projects for educational research. Scraping, cloning, or distributing source codes commercially without express written consent is strictly prohibited.",
      order: 2,
      status: "Active"
    },
    {
      id: "sec-3",
      title: "Sandbox Declarations",
      body: "All forms, databases, and estimates operate in safe sandbox demonstration pipelines.",
      order: 3,
      status: "Active"
    }
  ]
};

// GET Terms Policy Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "termsPolicy" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "termsPolicy", value: defaultTermsData });
    }
    ApiResponse.success(res, "Terms policy data retrieved successfully", cmsDoc.value || defaultTermsData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Terms Policy Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "termsPolicy" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "termsPolicyData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "terms" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await TermsPolicy.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("TermsPolicy model sync warning:", e);
    }

    ApiResponse.success(res, "Terms of Service updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
if (termsPolicyController) {
  const standardCmsRouter = createCmsRouter(termsPolicyController);
  router.use("/", standardCmsRouter);
}

export default router;
