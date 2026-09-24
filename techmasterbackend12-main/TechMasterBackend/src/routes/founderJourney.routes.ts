import { Router } from "express";
import { FounderJourney } from "../models/FounderJourney";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { founderJourneyController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultFounderJourneyData = {
  hero: {
    smallBadge: "WELCOME TO TECH MASTER'S JOURNEY",
    title: "Stories that",
    highlightText: "Stay with You",
    description: "Tracing the evolution from a single video in 2019 to the world's most-subscribed tech creator with over 20 billion views.",
    scrollText: "Explore timeline"
  },
  milestones: [
    { id: 'm-2019', year: '2019', subtitle: 'The First Upload', title: 'The First Upload', description: 'One video. No audience, no plan, no studio. Just one person from a small town who thought tech deserved better storytelling than it was getting.' },
    { id: 'm-2020', year: '2020', subtitle: 'The Silver Play Button', title: 'The Silver Play Button', description: "The first sign this wasn't a phase. One creator, one growing channel — and an audience that kept coming back." },
    { id: 'm-2021', year: '2021', subtitle: 'Two New Channels. One New Hire.', title: 'Two New Channels. One New Hire.', description: 'What was a one-person project became three. Two new channels launched, and Tech Master brought on its very first employee — the exact moment "someone\'s channel" started becoming a company.' },
    { id: 'm-2022', year: '2022', subtitle: 'First Brand Deal. First Studio.', title: 'First Brand Deal. First Studio.', description: 'A brand trusted us before we were "big enough" to matter. That trust funded our first real studio — the day content stopped being made out of a bedroom.' },
    { id: 'm-2023', year: '2023', subtitle: '10 Million and Counting', title: '10 Million and Counting', description: 'Tech Master Shorts crossed 10 million subscribers. An experiment had become a category of its own.' },
    { id: 'm-2024', year: '2024', subtitle: '25+ People. Seven Play Buttons.', title: '25+ People. Seven Play Buttons.', description: 'Twenty-five people, one mission, seven Play Buttons on the wall. Proof this stopped being one person\'s story a long time ago.' },
    { id: 'm-2025', year: '2025', subtitle: 'The Most-Subscribed Tech Creator on the Planet', title: 'The Most-Subscribed Tech Creator on the Planet', description: 'Every all-nighter, every idea that almost got cut, every video that didn\'t work until it did — it all built to this. Tech Master became the most-subscribed tech creator in the world.' },
    { id: 'm-2026', year: '2026', subtitle: '20 Billion Views. No One Else Has Done This.', title: '20 Billion Views. No One Else Has Done This.', description: 'The first tech creator in the world to cross 20 billion views on a single channel. The most-followed tech creator on Instagram, in the same year. Some milestones take a lifetime. We\'re just getting started.' }
  ],
  roadmap: {
    badge: "ROADMAP",
    heading: "Founder's",
    highlightHeading: "Growth Roadmap",
    subtitle: "Hover to Pause Timeline",
    items: [
      { id: 'rm-1', step: '01', year: '2021', title: '2021 — New Beginnings', description: 'What was a one-person project became three. Two new channels launched and our first employee joined.' },
      { id: 'rm-2', step: '02', year: '2022', title: '2022 — First Studio', description: 'A brand trusted us before we were big enough to matter. Content stopped being made in a bedroom.' },
      { id: 'rm-3', step: '03', year: '2023', title: '2023 — 10M Subscribers', description: 'Tech Master Shorts crossed 10 million subscribers. An experiment became a category of its own.' },
      { id: 'rm-4', step: '04', year: '2024', title: '2024 — Seven Play Buttons', description: 'Twenty-five people, one mission, seven Play Buttons on the wall.' },
      { id: 'rm-5', step: '05', year: '2025', title: '2025 — #1 Tech Creator', description: 'Every all-nighter built to this: Tech Master became the most-subscribed tech creator in the world.' },
      { id: 'rm-6', step: '06', year: '2026', title: '2026 — 20 Billion Views', description: 'The first tech creator in the world to cross 20 billion views on a single channel.' }
    ]
  }
};

// GET Founder Journey Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "founderJourney" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "founderJourney", value: defaultFounderJourneyData });
    }
    ApiResponse.success(res, "Founder Journey data retrieved successfully", cmsDoc.value || defaultFounderJourneyData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Founder Journey Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "founderJourney" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "journeyHero" }, { value: payload.hero }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "journeyMilestones" }, { value: payload.milestones }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "founder_journey" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await FounderJourney.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("FounderJourney model sync warning:", e);
    }

    ApiResponse.success(res, "Founder Journey data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(founderJourneyController);
router.use("/", standardCmsRouter);

export default router;
