import { Router } from "express";
import { WhatWeDo } from "../models/WhatWeDo";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { whatWeDoController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultWhatWeDoData = {
  hero: {
    smallBadge: "CORE ACTIVITIES",
    headline: "What We Do to",
    highlightWord: "Reshape Learning",
    description: "We build content, platforms, keynotes, and campaigns to bridge the gap between classroom syntax and global engineering workspaces."
  },
  operations: [
    {
      id: "op-1",
      icon: "Video",
      opNumber: "01",
      title: "YouTube Production",
      subtitle: "Cinematic Coding Breakdowns",
      description: "We scripting, record, and edit deep-dive developer tutorials that run like cinematic stories. Reaching over 2.5 million subscribers with weekly guides.",
      accent: "#D4AF37",
      status: "Active"
    },
    {
      id: "op-2",
      icon: "Code",
      opNumber: "02",
      title: "Interactive Syllabus Design",
      subtitle: "Online MasterClasses",
      description: "Drafting production-level courses that focus on Docker pipelines, testing arrays, and backend scale, complete with live browser containers.",
      accent: "#00E5FF",
      status: "Active"
    },
    {
      id: "op-3",
      icon: "Presentation",
      opNumber: "03",
      title: "Motivational Keynotes",
      subtitle: "TEDx & Global Tech Talks",
      description: "Aman travels worldwide delivering opening remarks on 'Democratizing Code' and soft skill strategies to help students bypass generic hiring cycles.",
      accent: "#aa3bff",
      status: "Active"
    },
    {
      id: "op-4",
      icon: "MessageSquareCode",
      opNumber: "04",
      title: "Community Hackathons",
      subtitle: "Empowerment Cohorts",
      description: "Hosting virtual/physical coding tournaments sponsored by Vercel and Google Cloud to give students direct placement links.",
      accent: "#FF007F",
      status: "Active"
    }
  ],
  servicesHeader: {
    badge: "OUR EXPERTISE",
    titleLine1: "Comprehensive",
    titleLine2: "Services"
  },
  servicesList: [
    { id: "srv-1", tag: "Content Creation" },
    { id: "srv-2", tag: "Influencer Marketing" },
    { id: "srv-3", tag: "Brand Promotions" },
    { id: "srv-4", tag: "Brand Campaigns" },
    { id: "srv-5", tag: "Product Launches" },
    { id: "srv-6", tag: "Event Hosting" },
    { id: "srv-7", tag: "Event Management" },
    { id: "srv-8", tag: "Corporate Collaborations" },
    { id: "srv-9", tag: "Digital Marketing" },
    { id: "srv-10", tag: "Personal Branding" },
    { id: "srv-11", tag: "Creative Consulting" },
    { id: "srv-12", tag: "Social Media Strategy" },
    { id: "srv-13", tag: "Creative Direction" },
    { id: "srv-14", tag: "Public Speaking" },
    { id: "srv-15", tag: "Workshop Sessions" }
  ],
  quoteBanner: {
    quoteText: "Education is not the learning of facts, but the training of the mind to think.",
    authorName: "Aman (Tech Master)",
    accentColor: "#D4AF37"
  }
};

// GET What We Do Data
router.get("/", async (req, res, next) => {
  try {
    let doc = await WhatWeDo.findOne({});
    if (!doc) {
      doc = await WhatWeDo.create(defaultWhatWeDoData);
    }
    ApiResponse.success(res, "What We Do data retrieved successfully", doc);
  } catch (err) {
    next(err);
  }
});

// PUT / Update What We Do Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const doc = await WhatWeDo.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "whatWeDo" }, { value: req.body }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "what_we_do" }, { value: req.body }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "whatWeDoData" }, { value: req.body }, { upsert: true, new: true });
    ApiResponse.success(res, "What We Do data updated successfully", doc);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(whatWeDoController);
router.use("/", standardCmsRouter);

export default router;
