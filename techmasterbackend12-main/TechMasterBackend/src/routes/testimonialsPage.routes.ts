import { Router } from "express";
import { TestimonialsPage } from "../models/TestimonialsPage";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { testimonialsPageController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultTestimonialsData = {
  hero: {
    smallBadge: "COMMUNITY ACCLAIM",
    title: "Student Placements & Academics Success",
    highlightText: "Academics Success",
    description: "Discover reviews from Aman's mentored students, university professors, and tech partners who have integrated our curricula."
  },
  successStats: [
    { id: '1', label: 'Placement Rate', value: '98', suffix: '%', icon: 'Award', color: '#D4AF37' },
    { id: '2', label: 'Average Salary', value: '14', suffix: 'LPA', icon: 'TrendingUp', color: '#00E5FF' },
    { id: '3', label: 'Students Hired', value: '1,200', suffix: '+', icon: 'Users', color: '#aa3bff' },
    { id: '4', label: 'Tech Partners', value: '45', suffix: '+', icon: 'Briefcase', color: '#FF007F' }
  ],
  videoTestimonials: [
    { id: '1', name: 'Rahul Sharma', role: 'SDE-2', company: 'Amazon', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', video: '' },
    { id: '2', name: 'Priya Patel', role: 'Frontend Engineer', company: 'Microsoft', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80', video: '' }
  ],
  writtenTestimonials: [
    { id: '1', name: 'Arjun Desai', designation: 'Backend Developer', company: 'Uber', rating: 5, review: 'The curriculum completely changed my perspective on distributed systems and system design architectures.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: '2', name: 'Neha Gupta', designation: 'Data Engineer', company: 'Meta', rating: 5, review: 'Aman’s teaching methodology is phenomenal. The practical approach helped me crack the toughest interviews.', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?auto=format&fit=crop&w=150&q=80' },
    { id: '3', name: 'Vikram Singh', designation: 'Full Stack Engineer', company: 'Google', rating: 5, review: 'The live coding sessions were eye-opening. I gained the confidence to build and deploy scalable applications.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
  ],
  categories: [
    { id: 'cat1', title: 'Software Engineering', icon: 'Terminal', description: 'Advanced programming tracks' },
    { id: 'cat2', title: 'Data Science', icon: 'Database', description: 'Analytics and ML tracks' }
  ],
  featuredQuote: {
    showSection: true,
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    subtitle: "Computer Scientist",
    accentColor: "#D4AF37"
  },
  whatWeDo: [
    { id: 'op1', title: 'Technical Interview Prep', subtitle: 'Algorithms & System Design', description: 'Intensive preparation for FAANG level interviews.', icon: 'Code' },
    { id: 'op2', title: 'Resume Review', subtitle: 'ATS Optimization', description: 'Crafting resumes that get shortlisted by top companies.', icon: 'FileText' }
  ]
};

// GET Testimonials Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "testimonialsCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "testimonialsCMS", value: defaultTestimonialsData });
    }
    ApiResponse.success(res, "Testimonials data retrieved successfully", cmsDoc.value || defaultTestimonialsData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Testimonials Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "testimonialsCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "testimonialsPageData" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "testimonials" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await TestimonialsPage.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("TestimonialsPage model sync warning:", e);
    }

    ApiResponse.success(res, "Testimonials data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(testimonialsPageController);
router.use("/", standardCmsRouter);

export default router;
