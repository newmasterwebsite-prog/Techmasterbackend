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

const documentFieldsHandler = handleMulterError(
  uploadDocument.fields([
    { name: "resume", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ])
);

export const parseDocument = (req: any, res: any, next: any) => {
  documentFieldsHandler(req, res, (err: any) => {
    if (err) return next(err);
    const files = req.files;
    if (files) {
      if (files["resume"] && files["resume"][0]) {
        req.file = files["resume"][0];
      } else if (files["file"] && files["file"][0]) {
        req.file = files["file"][0];
      } else if (files["document"] && files["document"][0]) {
        req.file = files["document"][0];
      }
    }
    next();
  });
};

