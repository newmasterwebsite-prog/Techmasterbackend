import { Router } from "express";
import { ProductLaunch } from "../models/ProductLaunch";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { productLaunchController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultLaunchesData = {
  hero: {
    smallBadge: "SOFTWARE RELEASES",
    headline: "Product Launches &",
    highlightWord: "Tech Innovations",
    description: "We construct platforms, terminal tools, and architectural sandbox spaces to help learners visual and configure engineering problems."
  },
  products: [
    {
      id: "prod-1",
      icon: "Laptop",
      title: "MasterClass App v2",
      tagline: "Gamified Interactive Code Learning",
      description: "Our core dashboard offering browser-based shell access, sandboxed docker execution, and step-by-step challenges covering system architectures.",
      status: "Active Launch",
      accent: "#D4AF37"
    },
    {
      id: "prod-2",
      icon: "Terminal",
      title: "DevEnv CLI utility",
      tagline: "Speed Up Local Node Configuration",
      description: "A fast terminal CLI utility that builds customized, performant TS, Vite, and tailwind stacks in seconds, downloaded 80k+ times.",
      status: "Open Source",
      accent: "#00E5FF"
    },
    {
      id: "prod-3",
      icon: "Layers",
      title: "System Sandbox Hub",
      tagline: "Interactive AWS & Docker diagrams",
      description: "A digital workspace where students can construct multi-tier architectures visually, export them, and trigger test loads.",
      status: "Beta Testing",
      accent: "#aa3bff"
    }
  ],
  featureVideo: {
    smallBadge: "LATEST LAUNCH VIDEO",
    headline: "MasterClass v2 Platform Launch Walkthrough",
    description: "Watch Aman demonstrate the sandboxed docker containers, web terminals, and the multiplayer live coding rooms that make learning code feel like a cooperative MMO game.",
    trailerBtnText: "Play Trailer",
    notesBtnText: "View Launch Notes",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"
  },
  initiativesHeader: {
    badge: "OUR WORK",
    titleLine1: "Launch",
    titleLine2: "Initiatives"
  },
  initiatives: [
    { id: "init-1", title: "Launch Events", description: "Hosting high-energy digital and physical events to unveil new platforms, creating massive day-one adoption and community buzz." },
    { id: "init-2", title: "Product Promotions", description: "Strategic marketing pushes that position developer tools directly in front of their ideal user base through trusted channels." },
    { id: "init-3", title: "Brand Launches", description: "End-to-end support for introducing new technology brands to the market, establishing authority and developer trust instantly." },
    { id: "init-4", title: "Campaign Videos", description: "Cinematic, deep-dive promotional videos that explain complex software architectures in a visually stunning and digestible format." },
    { id: "init-5", title: "Results", description: "We measure our success by tangible impact: tens of thousands of active accounts created, millions of impressions, and sustained engagement long after the initial launch phase ends." }
  ],
  downloads: [
    { id: "dl-1", platform: "Windows Installer (.exe)", version: "v2.4.1", size: "85 MB", link: "/download/win" },
    { id: "dl-2", platform: "macOS Universal (.dmg)", version: "v2.4.1", size: "92 MB", link: "/download/mac" },
    { id: "dl-3", platform: "Linux AppImage (.AppImage)", version: "v2.4.1", size: "78 MB", link: "/download/linux" }
  ]
};

// GET Product Launches Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "launchesData" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "launchesData", value: defaultLaunchesData });
    }
    ApiResponse.success(res, "Product launches data retrieved successfully", cmsDoc.value || defaultLaunchesData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Product Launches Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "launchesData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "productLaunchesCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "productLaunches" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "product_launches" }, { value: payload }, { upsert: true, new: true });

    try {
      await ProductLaunch.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("ProductLaunch model sync warning:", e);
    }

    ApiResponse.success(res, "Product launches data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(productLaunchController);
router.use("/", standardCmsRouter);

export default router;
