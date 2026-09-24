import { Response, NextFunction } from "express";
import { CloudinaryService } from "../services/cloudinary.service";
import { MediaLibrary } from "../models/Media";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";
import { AuthenticatedRequest } from "../middlewares/auth";

export class UploadController {
  /**
   * Upload single image
   */
  static async uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        return next(new AppError("No file uploaded", 400));
      }

      const result = await CloudinaryService.uploadBuffer(req.file.buffer, "techmaster/images", "image");
      
      const media = await MediaLibrary.create({
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        mediaType: "image",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        width: result.width,
        height: result.height,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
      });

      const mediaObj = media.toObject ? media.toObject() : media;
      ApiResponse.success(res, "Image uploaded successfully", {
        ...mediaObj,
        url: result.secure_url,
        imageUrl: result.secure_url,
        secure_url: result.secure_url
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return next(new AppError("No files uploaded", 400));
      }

      const uploadPromises = files.map(async (file) => {
        const result = await CloudinaryService.uploadBuffer(file.buffer, "techmaster/images", "image");
        return MediaLibrary.create({
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          mediaType: "image",
          fileName: file.originalname,
          fileSize: file.size,
          width: result.width,
          height: result.height,
          createdBy: req.user?.id,
          updatedBy: req.user?.id,
        });
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      ApiResponse.success(res, "Images uploaded successfully", uploadedMedia, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload single video
   */
  static async uploadVideo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        return next(new AppError("No video file uploaded", 400));
      }

      const result = await CloudinaryService.uploadBuffer(req.file.buffer, "techmaster/videos", "video");

      const media = await MediaLibrary.create({
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        mediaType: "video",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        width: result.width,
        height: result.height,
        duration: result.duration,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
      });

      const mediaObj = media.toObject ? media.toObject() : media;
      ApiResponse.success(res, "Video uploaded successfully", {
        ...mediaObj,
        url: result.secure_url,
        videoUrl: result.secure_url,
        secure_url: result.secure_url
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple videos
   */
  static async uploadVideos(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return next(new AppError("No video files uploaded", 400));
      }

      const uploadPromises = files.map(async (file) => {
        const result = await CloudinaryService.uploadBuffer(file.buffer, "techmaster/videos", "video");
        return MediaLibrary.create({
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
          mediaType: "video",
          fileName: file.originalname,
          fileSize: file.size,
          width: result.width,
          height: result.height,
          duration: result.duration,
          createdBy: req.user?.id,
          updatedBy: req.user?.id,
        });
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      ApiResponse.success(res, "Videos uploaded successfully", uploadedMedia, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete asset by Public ID
   */
  static async deleteAssetByPublicId(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId } = req.params;
      if (!publicId) {
        return next(new AppError("Public ID is required", 400));
      }

      const media = await MediaLibrary.findOne({ publicId, isDeleted: false });
      if (!media) {
        return next(new AppError("Media not found in database", 404));
      }

      // Delete from Cloudinary
      await CloudinaryService.deleteAsset(publicId, media.mediaType as any);

      // Soft delete in MongoDB
      media.isDeleted = true;
      media.deletedAt = new Date();
      media.updatedBy = req.user?.id;
      await media.save();

      ApiResponse.success(res, "Asset deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Replace existing asset
   */
  static async replaceAsset(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPublicId } = req.body;
      if (!oldPublicId) {
        return next(new AppError("Old Public ID is required", 400));
      }
      if (!req.file) {
        return next(new AppError("Replacement file is required", 400));
      }

      const oldMedia = await MediaLibrary.findOne({ publicId: oldPublicId, isDeleted: false });
      if (!oldMedia) {
        return next(new AppError("Old media resource not found", 404));
      }

      // Delete old from Cloudinary
      await CloudinaryService.deleteAsset(oldPublicId, oldMedia.mediaType as any);

      // Upload new to Cloudinary
      const folder = oldMedia.mediaType === "image" ? "techmaster/images" : "techmaster/videos";
      const result = await CloudinaryService.uploadBuffer(req.file.buffer, folder, oldMedia.mediaType as any);

      // Update Database Entry
      oldMedia.cloudinaryUrl = result.secure_url;
      oldMedia.publicId = result.public_id;
      oldMedia.fileName = req.file.originalname;
      oldMedia.fileSize = req.file.size;
      oldMedia.width = result.width;
      oldMedia.height = result.height;
      oldMedia.duration = result.duration;
      oldMedia.updatedBy = req.user?.id;
      await oldMedia.save();

      ApiResponse.success(res, "Asset replaced successfully", oldMedia);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Paginated and Filtered Media Library
   */
  static async getMedia(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, mediaType, page = 1, limit = 20, sortBy = "createdAt:desc" } = req.query;

      const filter: any = { isDeleted: false };

      // Search filters
      if (search) {
        filter.fileName = { $regex: search, $options: "i" };
      }
      if (mediaType) {
        filter.mediaType = mediaType;
      }

      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.max(1, Number(limit));
      const skip = (pageNumber - 1) * limitNumber;

      // Parsing sort
      const sortParts = (sortBy as string).split(":");
      const sortOrder = sortParts[1] === "asc" ? 1 : -1;
      const sortQuery = { [sortParts[0]]: sortOrder };

      const [mediaItems, total] = await Promise.all([
        MediaLibrary.find(filter)
          .sort(sortQuery as any)
          .skip(skip)
          .limit(limitNumber),
        MediaLibrary.countDocuments(filter),
      ]);

      ApiResponse.success(res, "Media library items retrieved successfully", {
        items: mediaItems,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single media item
   */
  static async getMediaById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const media = await MediaLibrary.findOne({ _id: req.params.id, isDeleted: false });
      if (!media) {
        return next(new AppError("Media item not found", 404));
      }
      ApiResponse.success(res, "Media item retrieved successfully", media);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete media item by Database ID
   */
  static async deleteMediaById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const media = await MediaLibrary.findOne({ _id: req.params.id, isDeleted: false });
      if (!media) {
        return next(new AppError("Media item not found", 404));
      }

      // Delete from Cloudinary
      await CloudinaryService.deleteAsset(media.publicId, media.mediaType as any);

      // Soft delete from Database
      media.isDeleted = true;
      media.deletedAt = new Date();
      media.updatedBy = req.user?.id;
      await media.save();

      ApiResponse.success(res, "Media item deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
export default UploadController;
