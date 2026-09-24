import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { AppError } from "../middlewares/errorHandler";

export class CloudinaryService {
  /**
   * Upload buffer directly to Cloudinary using streams
   * @param fileBuffer File buffer from Multer
   * @param folder Destination folder on Cloudinary
   * @param resourceType 'image' | 'video' | 'raw'
   */
  static async uploadBuffer(
    fileBuffer: Buffer,
    folder: string = "techmaster",
    resourceType: "image" | "video" | "raw" | "auto" = "auto",
    extraOptions: any = {}
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
        ...extraOptions
      };

      // Optimize images on the fly
      if (resourceType === "image") {
        uploadOptions.quality = "auto";
        uploadOptions.fetch_format = "auto";
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(new AppError(`Cloudinary Upload Failed: ${error.message}`, 500));
          } else if (result) {
            resolve(result);
          } else {
            reject(new AppError("Cloudinary returned empty response", 500));
          }
        }
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  /**
   * Delete asset from Cloudinary
   * @param publicId Cloudinary public_id
   * @param resourceType 'image' | 'video'
   */
  static async deleteAsset(
    publicId: string,
    resourceType: "image" | "video" | "raw" = "image"
  ): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error: any) {
      throw new AppError(`Cloudinary Delete Failed: ${error.message}`, 500);
    }
  }

  /**
   * Bulk delete assets
   * @param publicIds Array of public_ids
   */
  static async bulkDelete(publicIds: string[]): Promise<any> {
    try {
      return await cloudinary.api.delete_resources(publicIds);
    } catch (error: any) {
      throw new AppError(`Cloudinary Bulk Delete Failed: ${error.message}`, 500);
    }
  }
}
export default CloudinaryService;
