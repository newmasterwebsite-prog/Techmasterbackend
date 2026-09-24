import { Router } from "express";
import { Contact } from "../models/Contact";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { contactController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultContactData = {
  hero: {
    badge: "DIRECT PORTAL",
    heading: "Connect &",
    highlightHeading: "Launch Collaborations"
  },
  info: {
    email: "aman@techmaster.com",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "TechMaster HQ, Silicon Valley"
  },
  map: {
    url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580700d987b51%3A0xcb13e9a7e02e60f0!2sSilicon%20Valley!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
  },
  socials: [
    { platform: "Instagram", handle: "@aman_techmaster", url: "https://instagram.com" },
    { platform: "LinkedIn", handle: "/in/aman-tech", url: "https://linkedin.com" }
  ],
  categories: [
    { label: "Business Inquiry", value: "business" },
    { label: "Brand Collaboration", value: "collab" }
  ]
};

// GET Contact Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "contactPageData" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "contactPageData", value: defaultContactData });
    }
    ApiResponse.success(res, "Contact data retrieved successfully", cmsDoc.value || defaultContactData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Contact Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "contactPageData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "contactInfo" }, { value: payload.info || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "contactHero" }, { value: payload.hero || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "contact" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Contact.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Contact model sync warning:", e);
    }

    ApiResponse.success(res, "Contact data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(contactController);
router.use("/", standardCmsRouter);

export default router;
