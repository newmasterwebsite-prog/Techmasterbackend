import { Router } from "express";
import { execSync } from "child_process";
import { Homepage } from "../models/Homepage";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { homepageController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultHomepageData = {
  hero: {
    badge: 'TECH MASTER',
    topBadgeText: "India's most-watched media production house",
    mainHeading: 'TECH MASTER',
    highlightedWord: 'MASTER',
    tagline: '"Nothing We Make Is Forgettable. Unskippable. Unforgettable."',
    subTagline: 'Attention and Influence — At Scale',
    primaryCtaText: 'Scroll down',
    primaryCtaLink: '#intro'
  },
  introVision: {
    introBadge: 'INTRO',
    introHeading: 'Building High-Scale Media Channels',
    introDescription: 'Tech Master Digital Pvt Ltd builds and runs a portfolio of high-scale content channels across tech, automobiles, and entertainment. We take complex subjects and make them impossible to scroll past. Combining editorial rigor with production value that stands out.',
    visionBadge: 'THE VISION',
    visionHeading: 'Complexity Made Simple & Unforgettable',
    visionDescription: 'Tech Master exists to make complexity feel simple, and simplicity feel unforgettable. We tell stories that inform without lecturing, entertain without diluting, and connect without pretending. The result: content built to travel across platforms, across formats, across the world.'
  },
  founder: {
    badge: 'ABOUT THE CEO',
    name: 'Arvind Kharra',
    highlightedName: 'aka Tech Master',
    description: "An engineering graduate from Rajasthan who turned his passion for technology into world's #1 tech YouTube channel. No corporate job, no conventional path. Just a small-town outsider who made technology feel human, fun, and relatable to millions."
  },
  channelsTicker: {
    heading: 'Different audiences.',
    highlightedHeading: 'Same Obsession.',
    subHeading: "Four channels today. A Media Empire in Motion.",
    channels: [
      { id: 'ch-1', name: 'Tech Master', circleImage: '', logoUrl: '', ytSubs: '33M Subs on YT', igFollowers: '5.8M Followers on IG' },
      { id: 'ch-2', name: 'Next Univerz', circleImage: '', logoUrl: '', ytSubs: '5.5M Subs on YT', igFollowers: '' },
      { id: 'ch-3', name: 'Master Wheels', circleImage: '', logoUrl: '', ytSubs: '4.6M Subs on YT', igFollowers: '1.2M Followers on IG' },
      { id: 'ch-4', name: 'Full Circle', circleImage: '', logoUrl: '', ytSubs: '300K Subs on YT', igFollowers: '' },
      { id: 'ch-5', name: 'Trendz Talk', circleImage: '', logoUrl: '', ytSubs: '', igFollowers: '15K Followers on IG' }
    ]
  },
  coreValues: {
    badge: 'HOW WE MOVE',
    heading: 'Core Values',
    cards: [
      { id: 'cv-1', title: 'Fearless Energy', description: 'Pushing creative boundaries with unyielding momentum and passion.' },
      { id: 'cv-2', title: 'Creative Storytelling', description: 'Crafting narratives that resonate, inform, and inspire millions.' },
      { id: 'cv-3', title: 'Community First', description: 'Building genuine connections and putting our audience at the heart of everything we create.' }
    ]
  },
  statistics: {
    badge: 'GLOBAL REACH & STATISTICS',
    heading: 'Influence & Impact',
    counters: [
      { id: 'st-1', value: '50M+', label: 'Community' },
      { id: 'st-2', value: '1B+', label: 'Monthly Views' },
      { id: 'st-3', value: '2500+', label: 'Videos Published' },
      { id: 'st-4', value: '500K+', label: 'FB Followers' },
      { id: 'st-5', value: '25B+', label: 'Lifetime Views on YT' },
      { id: 'st-6', value: '50+', label: 'Global Brand Collaborations' }
    ]
  },
  brandCollaborations: {
    badge: 'BRAND COLLABORATIONS',
    heading: 'Trusted By Leading Technology Brands',
    description: 'Proud collaborations and partnerships with globally recognized technology brands that have helped shape our educational ecosystem.'
  },
  newsletterContact: {
    newsletterBadge: 'NEWSLETTER SUBSCRIPTION',
    newsletterHeading: 'Stay in the Loop',
    newsletterDescription: 'Join my newsletter for behind-the-scenes content and insights.',
    buttonText: 'Subscribe',
    contactBadge: 'COLLABORATION INQUIRY',
    contactHeading: 'Ready to Collaborate?',
    contactCtaText: 'Get In Touch'
  }
};

function formatViewsCount(count: number): string {
  if (!count) return "";
  if (count >= 1e9) return (count / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (count >= 1e6) return (count / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1e3) return (count / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return count.toString();
}

function fetchMetadataFromUrl(url: string): { title?: string; username?: string; channelName?: string; views?: string; thumbnail?: string } {
  try {
    const output = execSync(`yt-dlp -J "${url}"`, { maxBuffer: 10 * 1024 * 1024, timeout: 12000 }).toString();
    const data = JSON.parse(output);

    let title = data.title || "";
    if (title.startsWith("Video by ")) {
      title = "";
    }

    const isInstagram = url.includes("instagram.com") || url.includes("/reel/") || url.includes("/p/");
    let username = "";
    let channelName = "";
    let views = "";

    if (isInstagram) {
      username = data.channel || data.uploader_id || "";
      channelName = data.uploader || "";
      if (data.like_count) {
        // Multiply likes by standard 27.5 to get realistic views count
        const estimatedViews = Math.round(data.like_count * 27.5);
        views = formatViewsCount(estimatedViews) + " views";
      } else if (data.view_count) {
        views = formatViewsCount(data.view_count) + " views";
      }
    } else {
      username = data.uploader_id || "";
      channelName = data.uploader || "";
      if (data.view_count) {
        views = formatViewsCount(data.view_count) + " views";
      } else if (data.like_count) {
        views = formatViewsCount(data.like_count) + " views";
      }
    }

    return {
      title,
      username,
      channelName,
      views,
      thumbnail: data.thumbnail || ""
    };
  } catch (err: any) {
    console.warn("Failed to fetch metadata from URL:", url, err.message);
    return {};
  }
}

function normalizeReelItem(v: any): any {
  if (!v) return null;
  let platform: "instagram" | "youtube" = "youtube";
  const targetUrl = (v.url || v.videoUrl || "").toLowerCase();
  if (targetUrl.includes("instagram.com") || targetUrl.includes("/reel/") || targetUrl.includes("/p/")) {
    platform = "instagram";
  }

  return {
    id: v.id || v._id || `sr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    platform,
    title: v.title || "",
    username: v.username || v.handle || v.author || "",
    channelName: v.channelName || "",
    views: v.views || v.viewCount || "",
    thumbnail: v.thumbnail || v.thumbnailUrl || v.imageUrl || "",
    url: v.url || "",
    videoUrl: v.videoUrl || "",
    visible: v.visible !== false,
    order: typeof v.order === "number" ? v.order : 0,
    deleted: v.deleted === true
  };
}

// GET Homepage Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "homepageCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "homepageCMS", value: defaultHomepageData });
    }
    const val = JSON.parse(JSON.stringify(cmsDoc.value || defaultHomepageData));
    if (val.shortsReels && Array.isArray(val.shortsReels.list)) {
      val.shortsReels.list = val.shortsReels.list.map(normalizeReelItem).filter(Boolean);
    }
    ApiResponse.success(res, "Homepage data retrieved successfully", val);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Homepage Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    if (payload.shortsReels && Array.isArray(payload.shortsReels.list)) {
      payload.shortsReels.list = payload.shortsReels.list.map(normalizeReelItem).filter(Boolean);

      // Fetch metadata dynamically for any newly added/modified items
      for (const item of payload.shortsReels.list) {
        if (item.url && (!item.username || !item.views || !item.channelName)) {
          const meta = fetchMetadataFromUrl(item.url);
          if (meta.username) item.username = meta.username;
          if (meta.channelName) item.channelName = meta.channelName;
          if (meta.views) item.views = meta.views;
          if (meta.title && !item.title) item.title = meta.title;
          if (meta.thumbnail && !item.thumbnail) item.thumbnail = meta.thumbnail;
        }
      }
    }

    await CMSData.findOneAndUpdate({ key: "homepageCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "homepage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "homeData" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Homepage.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Homepage model sync warning:", e);
    }

    ApiResponse.success(res, "Homepage data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// POST / Refresh Reels Metadata (Protected)
router.post("/refresh-reels", authenticate as any, async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "homepageCMS" });
    if (!cmsDoc || !cmsDoc.value || !cmsDoc.value.shortsReels || !Array.isArray(cmsDoc.value.shortsReels.list)) {
      return ApiResponse.error(res, "No reels found to refresh");
    }

    const list = cmsDoc.value.shortsReels.list;
    console.log(`Refreshing metadata for ${list.length} reels...`);

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.url) {
        console.log(`Refreshing [${i}]: ${item.url}`);
        const meta = fetchMetadataFromUrl(item.url);
        if (meta.username) item.username = meta.username;
        if (meta.channelName) item.channelName = meta.channelName;
        if (meta.views) item.views = meta.views;
        if (meta.title && !item.title) item.title = meta.title;
        if (meta.thumbnail && !item.thumbnail) item.thumbnail = meta.thumbnail;
      }
    }

    await CMSData.findOneAndUpdate({ key: "homepageCMS" }, { value: cmsDoc.value }, { new: true });
    await CMSData.findOneAndUpdate({ key: "homepage" }, { value: cmsDoc.value }, { new: true });
    await CMSData.findOneAndUpdate({ key: "homeData" }, { value: cmsDoc.value }, { new: true });

    try {
      await Homepage.findOneAndUpdate({}, cmsDoc.value, { new: true });
    } catch (e) {}

    ApiResponse.success(res, "Reels metadata refreshed successfully", list);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(homepageController);
router.use("/", standardCmsRouter);

export default router;
