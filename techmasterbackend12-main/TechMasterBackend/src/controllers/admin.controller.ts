import { Response, NextFunction } from "express";
import { User } from "../models/User";
import { generateAccessToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../helpers/encryption";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";
import { AuthenticatedRequest } from "../middlewares/auth";

export class AdminController {
  /**
   * Admin Login
   */
  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new AppError("Email and Password are required", 400));
      }

      // Find user and explicitly select password field
      const user = await User.findOne({ email, isDeleted: false }).select("+password");
      if (!user) {
        return next(new AppError("Invalid email or password", 401));
      }

      if (user.status !== "Active") {
        return next(new AppError("Your account has been deactivated", 403));
      }

      // Compare passwords
      const isMatch = await comparePassword(password, user.password || "");
      if (!isMatch) {
        return next(new AppError("Invalid email or password", 401));
      }

      // Generate Access Token
      const token = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Update last login timestamp
      user.lastLogin = new Date();
      await user.save();

      ApiResponse.success(res, "Login successful", {
        admin: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin Logout
   */
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      ApiResponse.success(res, "Logout successful");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change Password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return next(new AppError("Current and new passwords are required", 400));
      }

      const user = await User.findById(req.user?.id).select("+password");
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Verify old password
      const isMatch = await comparePassword(oldPassword, user.password || "");
      if (!isMatch) {
        return next(new AppError("Incorrect current password", 400));
      }

      // Update password (pre-save hook will hash it automatically)
      user.password = newPassword;
      await user.save();

      ApiResponse.success(res, "Password updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot Password (mock placeholder)
   */
  static async forgotPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        return next(new AppError("Email is required", 400));
      }
      // Simple mockup response
      ApiResponse.success(res, "Reset link sent to your registered email address.");
    } catch (error) {
      next(error);
    }
  }
}
export default AdminController;
