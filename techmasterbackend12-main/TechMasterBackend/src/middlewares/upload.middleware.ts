import { Request, Response, NextFunction } from "express";
import { uploadImage, uploadVideo, uploadDocument } from "../utils/multer";
import { AppError } from "./errorHandler";

// Handle multer error wrapping
const handleMulterError = (multerHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerHandler(req, res, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError("File size is too large. Image limit is 10MB, Video is 100MB.", 400)
          );
        }
        return next(err);
      }
      next();
    });
  };
};

export const parseSingleImage = handleMulterError(uploadImage.single("file"));
export const parseMultipleImages = handleMulterError(uploadImage.array("files", 10));
export const parseSingleVideo = handleMulterError(uploadVideo.single("file"));
export const parseMultipleVideos = handleMulterError(uploadVideo.array("files", 5));
export const parseAnyMedia = handleMulterError(uploadVideo.single("file")); // accepts either, video config sets max limit (100MB)
export const parseDocument = handleMulterError(uploadDocument.single("resume"));
