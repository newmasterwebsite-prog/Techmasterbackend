import { Router } from "express";
import { Campaign } from "../models/Campaign";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { campaignController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultCampaignsData = {
  hero: {
    eyebrowText: "INITIATIVE CAMPAIGNS",
    title: "Empowerment Drives & Coding Challenges",
    highlightedTitle: "Coding Challenges",
    description: "Review our campaigns designed to bring cloud services, laptops, coding bootcamps, and career mentoring to students globally."
  },
  campaigns: [
    {
      id: "cp-1",
      title: "Vercel: Build in Public Challenge",
      description: "A 30-day global sprint encouraging developers to deploy full-stack Next.js applications with real-time feedback.",
      reach: "10,000+ Developers",
      sponsor: "Vercel",
      status: "Completed",
      coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      accentColor: "#D4AF37",
      highlights: ["10K+ Registrations", "5,000+ App Deployments", "$50K Cloud Credits"]
    },
    {
      id: "cp-2",
      title: "GitHub Open Source University Tour",
      description: "Visiting 50 university campuses worldwide to teach Git workflows, pull request etiquette, and open-source ethics.",
      reach: "25,000+ Students",
      sponsor: "GitHub",
      status: "Active",
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      accentColor: "#00E5FF",
      highlights: ["50 Campus Workshops", "2,500+ PRs Merged", "Exclusive Student Swag"]
    },
    {
      id: "cp-3",
      title: "Google Cloud Vertex AI Cohort",
      description: "Empowering 500 AI enthusiasts with hands-on Vertex AI pipelines, fine-tuning LLMs, and deploying cloud models.",
      reach: "500 AI Fellows",
      sponsor: "Google Cloud",
      status: "Active",
      coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      accentColor: "#aa3bff",
      highlights: ["500 Fellowships", "$500K Vertex Credits", "Direct Hiring Referrals"]
    }
  ],
  process: [
    { id: "pr-1", stepNumber: "01", title: "Campaign Planning", description: "Meticulously outlining timelines, allocating resources, and defining key performance indicators." },
    { id: "pr-2", stepNumber: "02", title: "Campaign Strategy", description: "Crafting narrative arcs and selecting digital channels to guarantee maximum developer reach." },
    { id: "pr-3", stepNumber: "03", title: "Campaign Execution", description: "Handling high-end video production, live moderation, and ground-level logistics." },
    { id: "pr-4", stepNumber: "04", title: "Analytics & Monitoring", description: "Real-time tracking of engagement metrics, audience retention, and click-through rates." },
    { id: "pr-5", stepNumber: "05", title: "Results & ROI Reports", description: "Delivering comprehensive post-campaign reports detailing brand lift and quantifiable outcomes." }
  ],
  successStories: [
    {
      id: "ss-1",
      title: "AWS Educate Drive",
      description: "By gamifying the learning process, we helped AWS register over 25,000 new student accounts in a single month.",
      linkText: "Read Full Story",
      accentColor: "#D4AF37"
    },
    {
      id: "ss-2",
      title: "MongoDB Hackathon",
      description: "A weekend-long virtual event that produced 500+ open-source database implementations for full-stack bootcamps.",
      linkText: "Read Full Story",
      accentColor: "#00E5FF"
    }
  ]
};

// GET Campaigns Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "campaignsPage" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "campaignsPage", value: defaultCampaignsData });
    }
    ApiResponse.success(res, "Campaigns data retrieved successfully", cmsDoc.value || defaultCampaignsData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Campaigns Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "campaignsPage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "campaignsCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "campaignsData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "campaigns" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Campaign.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Campaign model sync warning:", e);
    }

    ApiResponse.success(res, "Campaigns data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(campaignController);
router.use("/", standardCmsRouter);

export default router;
