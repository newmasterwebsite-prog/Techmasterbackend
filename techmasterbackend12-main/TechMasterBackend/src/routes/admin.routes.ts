import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth";
import { loginValidator } from "../validators/authValidator";
import { validateResult } from "../validators/validate";

const router = Router();

// Public routes
router.post("/login", loginValidator, validateResult, AdminController.login);
router.post("/forgot-password", AdminController.forgotPassword);

// Protected routes (require admin authentication)
router.post("/logout", authenticate as any, AdminController.logout);
router.put("/change-password", authenticate as any, AdminController.changePassword);

export default router;
