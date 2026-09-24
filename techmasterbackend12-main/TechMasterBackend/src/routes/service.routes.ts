import { Router } from "express";
import { Service } from "../models/Service";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { serviceController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultServicesData = {
  servicesPageData: {
    hero: {
      badge: "CORE PORTALS",
      title: "Services, Courses &",
      highlightText: "Keynote Bookings.",
      description: "Explore Aman's developer training tracks, speaking keynote requests, collaborative student hackathons, and brand sponsorships."
    },
    expertise: {
      badge: "OUR EXPERTISE",
      title: "Comprehensive",
      highlightText: "Solutions"
    },
    cta: {
      heading: "Ready to Transform Your Business?",
      subtext: "Let's discuss how we can help you achieve your goals.",
      buttonText: "Contact Us",
      buttonUrl: "/contact"
    }
  },
  servicesData: [
    {
      id: "srv-1",
      icon: "Sparkles",
      title: "Luxury Brand Strategy",
      tagline: "High-End Positioning & Identity",
      description: "Positioning luxury engineering and tech brands for ultra-high-net-worth market presence and authority.",
      overview: "Complete identity blueprints, luxury visual systems, and high-convert audience positioning.",
      benefits: ["Exclusive market positioning", "Premium brand perception", "High conversion equity"],
      process: ["Market Audit & Positioning Blueprint", "Visual System Design", "Global Brand Launch"],
      features: ["Brand Identity Blueprint", "Luxury Visual Assets", "Strategic Positioning"],
      accentColor: "#D4AF37",
      displayOrder: 1
    },
    {
      id: "srv-2",
      icon: "Cpu",
      title: "High-End Influencer Campaign Execution",
      tagline: "Multiverse Creator Syndication",
      description: "Strategic partnerships across top technology key opinion leaders, tech YouTubers, and developer creators.",
      overview: "End-to-end management of tier-1 tech influencer pushes reaching millions of engaged developers.",
      benefits: ["Direct developer audience trust", "Guaranteed impression scale", "High ROI conversion tracking"],
      process: ["Creator Vetting & Alignment", "Creative Scripting & Approval", "Multi-Channel Broadcast & Analytics"],
      features: ["Creator Network Access", "Campaign Tracking Dashboard", "Dedicated Account Manager"],
      accentColor: "#00E5FF",
      displayOrder: 2
    },
    {
      id: "srv-3",
      icon: "Layers",
      title: "Keynote & Public Speaking",
      tagline: "Global Tech Summits & Seminars",
      description: "Aman delivers mainstage keynotes, live coding demonstrations, and developer autonomy seminars globally.",
      overview: "Engaging, inspirational keynotes translating complex software architecture into 3D visual stories.",
      benefits: ["High-impact mainstage delivery", "Authentic audience engagement", "Full press kit & AV rider support"],
      process: ["Event Scope & Keynote Alignment", "Custom Slide & Live Sandbox Setup", "Mainstage Delivery & Q&A"],
      features: ["Mainstage Keynotes", "Live Sandbox Demos", "Q&A Cohort Sessions"],
      accentColor: "#aa3bff",
      displayOrder: 3
    },
    {
      id: "srv-4",
      icon: "Box",
      title: "UGC & Commercial Content Production",
      tagline: "Cinematic Product Spotlights",
      description: "High-production UGC, cinematic product trailers, and commercial developer breakdowns.",
      overview: "4K multi-cam production, 3D motion graphics, and high-retention commercial video assets.",
      benefits: ["Cinematic 4K production quality", "Higher viewer retention rates", "Multi-format social exports"],
      process: ["Concept & Storyboard Blueprint", "4K Multi-Cam Studio Filming", "3D Motion Graphics & Sound Design"],
      features: ["4K Studio Filming", "3D Motion Graphics", "Multi-Format Exports"],
      accentColor: "#FF007F",
      displayOrder: 4
    }
  ]
};

// GET Services Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "servicesCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "servicesCMS", value: defaultServicesData });
    }
    ApiResponse.success(res, "Services data retrieved successfully", cmsDoc.value || defaultServicesData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Services Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "servicesCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "servicesPageData" }, { value: payload.servicesPageData || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "servicesData" }, { value: payload.servicesData || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "coreServices" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Service.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Service model sync warning:", e);
    }

    ApiResponse.success(res, "Services data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(serviceController);
router.use("/", standardCmsRouter);

export default router;
