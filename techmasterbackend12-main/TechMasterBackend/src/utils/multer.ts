import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { AppError } from "../middlewares/errorHandler";

// Memory storage keeps files buffered in RAM
const storage = multer.memoryStorage();

// File extensions whitelist
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];

const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Unsupported image format. Allowed: JPG, JPEG, PNG, WEBP, GIF, SVG.", 400) as any, false);
  }
};

const videoFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Unsupported video format. Allowed: MP4, MOV, AVI, MKV, WEBM.", 400) as any, false);
  }
};

// Image upload config: 10MB limit
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Video upload config: 100MB limit
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf", 
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const documentFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Unsupported document format. Allowed: PDF, DOC, DOCX, PPT, PPTX.", 400) as any, false);
  }
};

export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});
