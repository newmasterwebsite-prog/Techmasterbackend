import { Router } from "express";
import { Collaboration } from "../models/Collaboration";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { collaborationController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultCollaborationsData = {
  hero: {
    eyebrowText: "BRAND COOPERATIONS",
    title: "Alliances & Brand Collaborations",
    highlightedTitle: "Brand Collaborations",
    description: "We join forces with leading technology companies and cloud giants to build open-source tools, launch hackathons, and deliver industry-relevant education."
  },
  brandCarousel: [
    { id: "bc-1", brandName: "GOOGLE CLOUD", status: "Active", order: 1 },
    { id: "bc-2", brandName: "AWS", status: "Active", order: 2 },
    { id: "bc-3", brandName: "GITHUB", status: "Active", order: 3 },
    { id: "bc-4", brandName: "VERCEL", status: "Active", order: 4 },
    { id: "bc-5", brandName: "STRIPE", status: "Active", order: 5 },
    { id: "bc-6", brandName: "NVIDIA", status: "Active", order: 6 },
    { id: "bc-7", brandName: "MICROSOFT", status: "Active", order: 7 },
    { id: "bc-8", brandName: "SHOPIFY", status: "Active", order: 8 }
  ],
  partners: [
    {
      id: "pt-1",
      name: "Vercel",
      type: "Frontend Cloud Partner",
      logo: "VC",
      featuredWork: "Next.js Masterclass Series",
      description: "Official cloud infrastructure sponsorship powering all interactive coding sandboxes for Next Univerz.",
      accentColor: "#D4AF37",
      status: "Active"
    },
    {
      id: "pt-2",
      name: "Google Cloud",
      type: "Infrastructure Sponsor",
      logo: "GC",
      featuredWork: "Global AI Hackathon 2026",
      description: "Providing $500,000 in Vertex AI credits for developer cohorts and live stream workshops.",
      accentColor: "#00E5FF",
      status: "Active"
    }
  ],
  metrics: [
    { id: "sm-1", value: "50+", label: "Brand Partners", status: "Active" },
    { id: "sm-2", value: "$2M+", label: "Sponsored Cloud Credits", status: "Active" },
    { id: "sm-3", value: "20+", label: "Global Hackathons", status: "Active" },
    { id: "sm-4", value: "5M+", label: "Campaign Impressions", status: "Active" }
  ],
  campaigns: [
    {
      id: "cp-1",
      title: "Vercel: Build in Public",
      description: "A 30-day challenge where 10,000 developers built and deployed Next.js applications on Vercel.",
      accentColor: "#D4AF37",
      buttonText: "View Highlight",
      status: "Active"
    },
    {
      id: "cp-2",
      title: "GitHub Education Tour",
      description: "Sponsored university tour reaching 50 campuses to promote open-source contributions.",
      accentColor: "#00E5FF",
      buttonText: "View Highlight",
      status: "Active"
    }
  ],
  history: {
    eyebrow: "TIMELINE",
    title: "Collaboration History",
    highlightedTitle: "History",
    description: "Since our first brand deal in 2018, we have maintained long-term relationships with the world's most innovative companies. Our history is built on delivering genuine value to both the developer community and our partners.",
    cardTitle: "From Startups to Enterprises",
    cardDescription: "Whether it's an early-stage AI tool or an established cloud provider, we tailor our integration to fit the product's unique value proposition."
  },
  process: [
    { id: "pr-1", stepNumber: "01", title: "Discovery & Alignment", status: "Active" },
    { id: "pr-2", stepNumber: "02", title: "Creative Strategy & Scripting", status: "Active" },
    { id: "pr-3", stepNumber: "03", title: "Production & Integration", status: "Active" },
    { id: "pr-4", stepNumber: "04", title: "Launch & Analytics", status: "Active" }
  ],
  testimonials: [
    {
      id: "tm-1",
      quote: "Working with Tech Master has been transformative. Their ability to explain complex APIs to junior developers drove massive adoption for our new features.",
      personName: "Sarah Jenkins",
      designation: "VP of Developer Relations",
      company: "Vercel",
      accentColor: "#D4AF37",
      status: "Active"
    },
    {
      id: "tm-2",
      quote: "The engagement on the sponsored hackathon was unprecedented. We reached exactly the demographic we were aiming for.",
      personName: "David Chen",
      designation: "Global Developer Ecosystem Lead",
      company: "Google Cloud",
      accentColor: "#00E5FF",
      status: "Active"
    }
  ]
};

// GET Collaborations Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "collaborationsPage" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "collaborationsPage", value: defaultCollaborationsData });
    }
    ApiResponse.success(res, "Collaborations data retrieved successfully", cmsDoc.value || defaultCollaborationsData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Collaborations Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "collaborationsPage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "collaborationsCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "collaborations" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Collaboration.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Collaboration model sync warning:", e);
    }

    ApiResponse.success(res, "Collaborations data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(collaborationController);
router.use("/", standardCmsRouter);

export default router;
