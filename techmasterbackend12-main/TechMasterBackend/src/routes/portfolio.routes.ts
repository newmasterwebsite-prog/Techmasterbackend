import { Router } from "express";
import { Portfolio } from "../models/Portfolio";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { portfolioController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultPortfolioData = {
  hero: {
    badge: "CREATIVE ECOSYSTEM",
    title: "The",
    highlightText: "Multiverse",
    description: "Masterpieces In Motion — Our portfolio of 5 high-scale content channels spanning technology, automotive, podcasts, and viral entertainment."
  },
  channels: [
    {
      id: "ch-1",
      name: "1. Tech Master",
      desc: "High-scale technology breakdowns, hardware reviews, and cinematic teardowns.",
      stats: ["33M Subs on YT", "5.8M Followers on IG"],
      ytSubs: "33M Subs on YT",
      igFollowers: "5.8M Followers on IG",
      popular: "195M (Short) • 219M (Reel)",
      link: "https://www.youtube.com/@techmasterhq",
      accent: "#D4AF37"
    },
    {
      id: "ch-2",
      name: "2. Next Univerz",
      desc: "Engineering insights, software masterclasses, and digital transformation.",
      stats: ["5.5M Subs on YT"],
      ytSubs: "5.5M Subs on YT",
      igFollowers: "",
      popular: "88M (Shorts) • 4.6M (Long)",
      link: "https://www.youtube.com/@NextUniverz",
      accent: "#00E5FF"
    },
    {
      id: "ch-3",
      name: "3. Master Wheels",
      desc: "Supercar testing, EV innovations, and automotive engineering marvels.",
      stats: ["4.6M Subs on YT", "1.2M Followers on IG"],
      ytSubs: "4.6M Subs on YT",
      igFollowers: "1.2M Followers on IG",
      popular: "1.7M (Long) • 148M (Short) • 70M (Reel)",
      link: "https://www.youtube.com/@MasterWheelsAK",
      accent: "#FF3366"
    },
    {
      id: "ch-4",
      name: "4. Full Circle",
      desc: "Deep-dive conversations, creator podcasts, and behind-the-scenes stories.",
      stats: ["300K Subs on YT"],
      ytSubs: "300K Subs on YT",
      igFollowers: "",
      popular: "2M (Short)",
      link: "https://www.youtube.com/@fullcircle_in",
      accent: "#AA3BFF"
    },
    {
      id: "ch-5",
      name: "5. Trendz Talk",
      desc: "Viral tech trends, short-form pop tech, and culture storytelling.",
      stats: ["15K Followers on IG"],
      ytSubs: "",
      igFollowers: "15K Followers on IG",
      popular: "4.8M (Reel)",
      link: "https://www.instagram.com/techmasterco/",
      accent: "#00FF66"
    }
  ],
  categories: ["Videos", "Photos", "Projects", "Campaigns", "Reels", "Commercial Shoots", "Client Work"],
  projects: [
    {
      id: "proj-1",
      title: "Asus ROG Phone 8 Global Reveal",
      category: "Videos",
      client: "ASUS Gaming",
      year: "2026",
      description: "Complete commercial production, 3D gaming render animations, and multi-channel launch across Tech Master ecosystem.",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      accentColor: "#D4AF37",
      tags: ["3D Animation", "Commercial Shoot", "Hardware Review"],
      buttonText: "Review Case",
      buttonUrl: "https://youtube.com"
    },
    {
      id: "proj-2",
      title: "Tesla Cyberbeast Track Performance Test",
      category: "Commercial Shoots",
      client: "Master Wheels",
      year: "2026",
      description: "High-speed 4K tracking camera production at Buddh International Circuit testing top-speed telemetry.",
      imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
      accentColor: "#FF3366",
      tags: ["Automotive", "High-Speed Cinema", "Telemetry"],
      buttonText: "Review Case",
      buttonUrl: "https://youtube.com"
    },
    {
      id: "proj-3",
      title: "Next Univerz Full-Stack Masterclass",
      category: "Projects",
      client: "Next Univerz",
      year: "2025",
      description: "Curriculum design, interactive coding sandbox development, and 50+ video production modules.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      accentColor: "#00E5FF",
      tags: ["Education", "Full-Stack", "Masterclass"],
      buttonText: "Review Case",
      buttonUrl: "https://youtube.com"
    }
  ]
};

// GET Portfolio Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "portfolioCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "portfolioCMS", value: defaultPortfolioData });
    }
    ApiResponse.success(res, "Portfolio data retrieved successfully", cmsDoc.value || defaultPortfolioData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Portfolio Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "portfolioCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "portfolioPage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "ourWork" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "portfolioHero" }, { value: payload.hero }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "portfolioFilters" }, { value: payload.categories }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "multiverseChannels" }, { value: payload.channels }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "portfolio" }, { value: payload.projects || payload }, { upsert: true, new: true });
    
    try {
      await Portfolio.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Portfolio model sync warning:", e);
    }

    ApiResponse.success(res, "Portfolio data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(portfolioController);
router.use("/", standardCmsRouter);

export default router;
