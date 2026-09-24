import { Router } from "express";
import { Event } from "../models/Event";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { eventController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultEventsData = {
  hero: {
    smallBadge: "PUBLIC ENGAGEMENTS",
    headline: "Keynote Speaking &",
    highlightWord: "Live Coding Seminars",
    description: "Aman shares developer insights, soft-skills blueprints, and live systems architecture demonstrations on global stages."
  },
  eventsList: [
    {
      id: "evt-1",
      title: "React India 2024 Keynote",
      type: "INTERNATIONAL KEYNOTE",
      date: "OCTOBER 2024",
      location: "GOA, INDIA",
      attendance: "1,500+ ATTENDEES",
      description: "Delivering opening keynote on Concurrent Rendering patterns & real-time WebGL UI architectures.",
      accentColor: "#D4AF37",
      media: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      status: "Active"
    },
    {
      id: "evt-2",
      title: "AWS Community Day",
      type: "SYSTEM ARCHITECTURE TALK",
      date: "DECEMBER 2024",
      location: "BENGALURU, INDIA",
      attendance: "3,000+ ATTENDEES",
      description: "Live breakdown of multi-region database replication & serverless container scaling.",
      accentColor: "#00E5FF",
      media: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=600&q=80",
      status: "Active"
    },
    {
      id: "evt-3",
      title: "Open Source Developers Summit",
      type: "PANEL DISCUSSION",
      date: "MARCH 2025",
      location: "NEW DELHI, INDIA",
      attendance: "2,200+ ATTENDEES",
      description: "Panel discussion on democratizing software engineering curricula and developer autonomy.",
      accentColor: "#aa3bff",
      media: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
      status: "Active"
    }
  ],
  engagementTypesHeader: {
    badge: "CAPABILITIES",
    titleLine1: "Engagement",
    titleLine2: "Types"
  },
  engagementTypes: [
    { id: "et-1", type: "Event Hosting", order: 1, visible: true },
    { id: "et-2", type: "Guest Appearance", order: 2, visible: true },
    { id: "et-3", type: "Corporate Events", order: 3, visible: true },
    { id: "et-4", type: "Fashion Shows", order: 4, visible: true },
    { id: "et-5", type: "Product Events", order: 5, visible: true },
    { id: "et-6", type: "Meetups", order: 6, visible: true },
    { id: "et-7", type: "Workshops", order: 7, visible: true },
    { id: "et-8", type: "Conferences", order: 8, visible: true }
  ],
  bookingSection: {
    smallBadge: "SPEAKER BOOKINGS",
    headlineLine1: "Bring Aman to",
    highlightWord: "Your Event",
    description: "Aman keynote schedules fill up rapidly. Bookings are open for university developer panels, virtual technical summits, DevFests, or corporate software consulting cycles.",
    pressKitNote: "Full Press Kit and AV Rider available upon approval."
  },
  bookingInquiries: [
    { id: "inq-1", name: "David Miller", email: "david@devfest.org", organization: "DevFest 2026", details: "Keynote speaking request for 5,000 developer attendees.", status: "Pending", date: "Today" }
  ]
};

// GET Events Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "eventsData_CMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "eventsData_CMS", value: defaultEventsData });
    }
    ApiResponse.success(res, "Events data retrieved successfully", cmsDoc.value || defaultEventsData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Events Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "eventsData_CMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "eventsCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "eventsPage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "eventsData" }, { value: payload.eventsList || payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "events" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Event.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Event model sync warning:", e);
    }

    ApiResponse.success(res, "Events data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(eventController);
router.use("/", standardCmsRouter);

export default router;
