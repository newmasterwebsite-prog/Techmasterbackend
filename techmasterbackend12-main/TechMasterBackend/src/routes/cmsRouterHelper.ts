import { Router } from "express";
import { BaseController } from "../controllers/base.controller";
import { authenticate } from "../middlewares/auth";
import { paramIdValidator, statusValidator } from "../validators/cmsValidator";
import { validateResult } from "../validators/validate";

/**
 * Reusable route builder helper that generates standard CRUD endpoints for any base controller.
 * Saves boilerplate code while retaining type safety and architecture standards.
 */
export const createCmsRouter = (controller: BaseController<any>): Router => {
  const router = Router();

  // 1. GET ALL
  router.get("/", controller.getAll);

  // 2. GET BY ID
  router.get("/:id", paramIdValidator, validateResult, controller.getById);

  // 3. CREATE (Protected)
  router.post("/", authenticate as any, controller.create);

  // 4. UPDATE (Protected)
  router.put("/:id", authenticate as any, paramIdValidator, validateResult, controller.update);

  // 5. SOFT DELETE (Protected) - using DELETE method for simplicity or mapped endpoint
  router.delete("/:id", authenticate as any, paramIdValidator, validateResult, controller.softDelete);

  // 6. RESTORE (Protected)
  router.patch("/:id/restore", authenticate as any, paramIdValidator, validateResult, controller.restore);

  // 7. PUBLISH (Protected)
  router.patch("/:id/publish", authenticate as any, paramIdValidator, validateResult, controller.publish);

  // 8. UNPUBLISH (Protected)
  router.patch("/:id/unpublish", authenticate as any, paramIdValidator, validateResult, controller.unpublish);

  // 9. STATUS UPDATE (Protected)
  router.patch("/:id/status", authenticate as any, statusValidator, validateResult, controller.updateStatus);

  return router;
};
