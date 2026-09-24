import { Router } from "express";
import { Faq } from "../models/FAQ";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { faqController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultFaqData = {
  settings: {
    badge: "INFORMATION ARCHIVE",
    heading: "Answers &",
    highlightHeading: "Frequently Asked Questions"
  },
  faqs: [
    { id: '1', question: "What is your main service?", answer: "We provide enterprise tech solutions.", category: "General", order: 1 }
  ]
};

// GET FAQ Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "faqPageData" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "faqPageData", value: defaultFaqData });
    }
    ApiResponse.success(res, "FAQ data retrieved successfully", cmsDoc.value || defaultFaqData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update FAQ Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "faqPageData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "faqs" }, { value: payload.faqs || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "faq" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Faq.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Faq model sync warning:", e);
    }

    ApiResponse.success(res, "FAQ data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(faqController);
router.use("/", standardCmsRouter);

export default router;
