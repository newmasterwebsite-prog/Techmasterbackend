import { Router } from "express";
import { MissionVision } from "../models/MissionVision";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { missionVisionController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultMVData = {
  hero: {
    badge: "OUR NORTH STAR",
    headingLine1: "Democratizing",
    highlightText: "Tech Literacy",
    headingLine2: "Globally",
    description: "We believe high-quality engineering curricula shouldn't be locked behind expensive student debts. Aman is building the tools to make code accessible to every curious mind on earth."
  },
  mission: {
    label: "THE MISSION STATEMENT",
    title: "To inspire, educate, and place the next million full-stack developers.",
    description: "Our target is to break down complex system design systems, database architectures, and compiler dynamics into engaging, cinematic formats. We enable students to transition seamlessly from beginners to self-sufficient contributors."
  },
  vision: {
    label: "THE FUTURE VISION",
    title: "Vision 2030: Bridging the global developer deficit.",
    description: "Technology evolves at a rapid pace, yet university syllabi remain outdated. We are constructing an open, adaptive, cloud-native learning playground that responds directly to modern tech requirements."
  },
  coreValuesHeader: {
    badge: "OUR FUNDAMENTAL PRINCIPLES",
    titleLine1: "The Values that",
    titleLine2: "Drive Us",
    titleLine3: "Forward"
  },
  coreValues: [
    { title: "Cinematic Pedagogy", description: "Translating dry software engineering documentation into visual 3D storytelling.", accentColor: "#D4AF37", status: "Active" },
    { title: "Open Source Ethos", description: "Empowering developers to build in public and contribute to core frameworks.", accentColor: "#00E5FF", status: "Active" },
    { title: "Industry Alignment", description: "Curricula designed directly by senior principal engineers from tier-1 tech companies.", accentColor: "#aa3bff", status: "Active" },
    { title: "Self-Sustaining Autonomy", description: "Teaching problem-solving blueprints rather than just copy-pasting code snippets.", accentColor: "#FF007F", status: "Active" }
  ],
  brandPillarsHeader: {
    badge: "OUR PILLARS",
    titleLine1: "",
    titleLine2: "",
    titleLine3: ""
  },
  brandPillars: [
    { title: "Full-Stack Architecture", subtitle: "Next.js • Node.js • Distributed Systems", description: "Comprehensive coverage from browser rendering loops down to database sharding.", borderColor: "#D4AF37", status: "Active" },
    { title: "Interactive Sandboxes", subtitle: "Cloud-Native Playground", description: "Zero-config, browser-based container environments for instant code execution.", borderColor: "#00E5FF", status: "Active" },
    { title: "Career Placement Engine", subtitle: "Direct Partner Referrals", description: "Connecting top 1% graduates directly with high-growth venture-backed startups.", borderColor: "#aa3bff", status: "Active" },
    { title: "Creator Ecosystem", subtitle: "Multiverse Content Channels", description: "Syndicating short-form breakdowns and documentaries across 5 core channels.", borderColor: "#FF007F", status: "Active" }
  ],
  roadmapHeader: {
    badge: "STRATEGIC ROADMAP",
    titleLine1: "Our",
    titleLine2: "Roadmap to 2030",
    description: "Hover to Pause Timeline"
  },
  roadmap: [
    { year: "2024", quarter: "Q1", title: "Studio Suite Launch", goal: "JAIPUR HEADQUARTERS", description: "Established 4K multi-cam production suite & 3D render pipeline.", status: "Completed", accentColor: "#D4AF37" },
    { year: "2025", quarter: "Q2", title: "Next Univerz Sandbox", goal: "WEB DEV PLAYGROUND", description: "Launched browser-based interactive terminal & code compiler sandbox.", status: "Active", accentColor: "#00E5FF" },
    { year: "2026", quarter: "Q3", title: "Multiverse 5M Sub", goal: "GLOBAL AUDIENCE", description: "Expanding developer reach across 5 dedicated YouTube & IG channels.", status: "In Progress", accentColor: "#aa3bff" },
    { year: "2030", quarter: "Q4", title: "Open Tech University", goal: "DECENTRALIZED DEGREE", description: "Accredited open engineering diploma recognized by global tech giants.", status: "Planning", accentColor: "#FF007F" }
  ],
  cta: {
    heading: "Ready to Build Your Engineering Career?",
    description: "Join thousands of developers in our interactive sandbox playgrounds and master production-ready code.",
    primaryButtonText: "Get Started",
    primaryButtonLink: "/signup",
    secondaryButtonText: "Contact Admissions",
    secondaryButtonLink: "/contact"
  }
};

// GET Mission & Vision Data
router.get("/", async (req, res, next) => {
  try {
    let doc = await MissionVision.findOne({});
    if (!doc) {
      doc = await MissionVision.create(defaultMVData);
    }
    ApiResponse.success(res, "Mission & Vision data retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Mission & Vision Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const doc = await MissionVision.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "missionVision" }, { value: req.body }, { upsert: true, new: true });
    ApiResponse.success(res, "Mission & Vision data updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(missionVisionController);
router.use("/", standardCmsRouter);

export default router;
