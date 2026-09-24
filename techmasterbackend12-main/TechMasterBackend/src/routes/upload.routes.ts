import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { authenticate } from "../middlewares/auth";
import {
  parseSingleImage,
  parseMultipleImages,
  parseSingleVideo,
  parseMultipleVideos,
  parseAnyMedia,
} from "../middlewares/upload.middleware";

const router = Router();

// Ensure all upload and media management endpoints are protected via JWT authentication
router.use(authenticate as any);

// 1. Upload Actions
router.post("/image", parseSingleImage, UploadController.uploadImage);
router.post("/images", parseMultipleImages, UploadController.uploadImages);
router.post("/video", parseSingleVideo, UploadController.uploadVideo);
router.post("/videos", parseMultipleVideos, UploadController.uploadVideos);
router.patch("/replace", parseAnyMedia, UploadController.replaceAsset);
router.delete("/public-id/:publicId", UploadController.deleteAssetByPublicId);

// 2. Media Library Browsing and Management
router.get("/", UploadController.getMedia);
router.get("/:id", UploadController.getMediaById);
router.delete("/:id", UploadController.deleteMediaById);

export default router;
