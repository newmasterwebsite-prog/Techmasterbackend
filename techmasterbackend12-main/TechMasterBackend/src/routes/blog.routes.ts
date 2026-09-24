import { Router } from "express";
import { Blog } from "../models/Blog";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { blogController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultBlogData = {
  blogHero: {
    badge: "CREATOR JOURNAL",
    titleLine1: "Latest Blogs",
    titleLine2: "Insights & Guides",
    animationEnabled: true,
    glowEnabled: true,
    active: true
  },
  featuredStrategy: {
    badge: "Featured Strategy",
    titleLine1: "Engineering",
    titleLine2: "Content Marketing",
    titleLine3: "Excellence",
    description: "Traditional advertising has diminishing returns. We help engineering brands build market authority through high-utility technical content, storytelling, and high-impact distribution loops.",
    active: true
  },
  strategyStats: [
    { id: "ss-1", number: "10M+", label: "Impressions", order: 1, active: true },
    { id: "ss-2", number: "+150%", label: "Engagement", order: 2, active: true },
    { id: "ss-3", number: "4.8x", label: "Content ROI", order: 3, active: true }
  ],
  strategyPillars: [
    { id: "sp-1", icon: "Users", title: "Audience Retention", description: "Translate complex system architecture into clean narratives.", order: 1, active: true },
    { id: "sp-2", icon: "BarChart3", title: "Search Dominance", description: "Rank first for high-intent queries that developers actually search.", order: 2, active: true },
    { id: "sp-3", icon: "TrendingUp", title: "Distribution Loops", description: "Syndicate deep-dives into social threads, shorts, and digests.", order: 3, active: true }
  ],
  strategyPresets: [
    { id: "solopreneur", presetName: "solopreneur", badge: "Solo Creator", impressions: "50K - 100K+", channel: "Twitter/X, Dev.to & LinkedIn", focus: "Build in public, share raw learnings, create highly readable dev cheatsheets.", roi: "High authority, premium lead acquisition", active: true },
    { id: "startup", presetName: "startup", badge: "Growth Startup", impressions: "250K - 500K+", channel: "GitHub, Medium, Tech Newsletters", focus: "Detailed technical case studies, comparisons, integration guides, and live streams.", roi: "Product signups, community growth", active: true },
    { id: "enterprise", presetName: "enterprise", badge: "Enterprise Brand", impressions: "1M - 5M+", channel: "YouTube Documentaries, Dedicated Hubs", focus: "High-production whitepapers, engineering-led media channels.", roi: "Market standard positioning, enterprise adoption", active: true }
  ],
  blogCategories: [
    { id: "bc-1", name: "All", slug: "all", order: 1, active: true },
    { id: "bc-2", name: "Lifestyle", slug: "lifestyle", order: 2, active: true },
    { id: "bc-3", name: "Marketing", slug: "marketing", order: 3, active: true },
    { id: "bc-4", name: "Branding", slug: "branding", order: 4, active: true },
    { id: "bc-5", name: "Creator Journey", slug: "creator-journey", order: 5, active: true },
    { id: "bc-6", name: "Tips", slug: "tips", order: 6, active: true },
    { id: "bc-7", name: "Latest News", slug: "latest-news", order: 7, active: true }
  ],
  latestInsights: {
    title: "Latest Insights",
    subtitle: "Browse thoughts, guides, and updates from the team",
    active: true
  },
  blogs: [
    {
      id: "blog-1",
      title: "The Art of Golden Ratios in Modern Luxury Branding",
      slug: "golden-ratios-luxury-branding",
      category: "Branding",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      excerpt: "Exploring mathematical elegance in high-fashion identity design and visual hierarchy.",
      content: "Detailed technical whitepaper on golden ratios in modern digital branding...",
      publishDate: "2026-07-20",
      readTime: "6 min read",
      author: "Aman",
      featured: true,
      status: "published",
      active: true
    },
    {
      id: "blog-2",
      title: "Building 60FPS Three.js Configurators for WebGL",
      slug: "60fps-threejs-configurators",
      category: "Marketing",
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      excerpt: "Optimizing GPU memory buffers, draw calls, and lighting shaders for interactive browser experiences.",
      content: "Deep-dive technical guide into Three.js performance tuning...",
      publishDate: "2026-07-15",
      readTime: "10 min read",
      author: "TechMaster Lead",
      featured: true,
      status: "published",
      active: true
    }
  ]
};

// GET Blog Bundle Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "blogCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "blogCMS", value: defaultBlogData });
    }
    const dbBlogs = await Blog.find({});
    const data = {
      ...defaultBlogData,
      ...(cmsDoc.value || {}),
      blogs: (dbBlogs && dbBlogs.length > 0) ? dbBlogs : (cmsDoc.value?.blogs || defaultBlogData.blogs)
    };
    ApiResponse.success(res, "Blog data retrieved successfully", data);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Blog Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "blogCMS" }, { value: payload }, { upsert: true, new: true });
    
    if (payload.blogs && Array.isArray(payload.blogs)) {
      await CMSData.findOneAndUpdate({ key: "blogs" }, { value: payload.blogs }, { upsert: true, new: true });
      await CMSData.findOneAndUpdate({ key: "blogsData" }, { value: payload.blogs }, { upsert: true, new: true });
      
      try {
        await Blog.deleteMany({});
        const records = payload.blogs.map((b: any) => ({
          ...b,
          _id: (b.id && /^[0-9a-fA-F]{24}$/.test(b.id)) ? b.id : undefined
        }));
        await Blog.insertMany(records);
      } catch (e) {
        console.warn("Blog model sync warning:", e);
      }
    }

    if (payload.blogHero) await CMSData.findOneAndUpdate({ key: "blogHero" }, { value: payload.blogHero }, { upsert: true, new: true });
    if (payload.featuredStrategy) await CMSData.findOneAndUpdate({ key: "featuredStrategy" }, { value: payload.featuredStrategy }, { upsert: true, new: true });
    if (payload.strategyStats) await CMSData.findOneAndUpdate({ key: "strategyStats" }, { value: payload.strategyStats }, { upsert: true, new: true });
    if (payload.strategyPillars) await CMSData.findOneAndUpdate({ key: "strategyPillars" }, { value: payload.strategyPillars }, { upsert: true, new: true });
    if (payload.strategyPresets) await CMSData.findOneAndUpdate({ key: "strategyPresets" }, { value: payload.strategyPresets }, { upsert: true, new: true });
    if (payload.blogCategories) await CMSData.findOneAndUpdate({ key: "blogCategories" }, { value: payload.blogCategories }, { upsert: true, new: true });
    if (payload.latestInsights) await CMSData.findOneAndUpdate({ key: "latestInsights" }, { value: payload.latestInsights }, { upsert: true, new: true });

    ApiResponse.success(res, "Blog data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(blogController);
router.use("/", standardCmsRouter);

export default router;
