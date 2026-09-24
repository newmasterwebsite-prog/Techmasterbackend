import { Router } from "express";
import { About } from "../models/About";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { aboutController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

// GET About Page Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "about" });
    let doc = await About.findOne({});
    const responseData = cmsDoc?.value || doc || {};
    ApiResponse.success(res, "About data retrieved successfully", responseData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update About Page Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "about" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "aboutTechMaster" }, { value: payload.aboutTechMaster || payload }, { upsert: true, new: true });
    
    try {
      await About.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("About model sync warning:", e);
    }

    ApiResponse.success(res, "About data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(aboutController);
router.use("/", standardCmsRouter);

export default router;
