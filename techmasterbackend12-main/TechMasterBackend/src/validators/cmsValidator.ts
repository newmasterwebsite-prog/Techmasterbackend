import { param, body } from "express-validator";

/**
 * Validate MongoDB ObjectId in request route parameters (e.g. /:id)
 */
export const paramIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid resource ID format"),
];

/**
 * Validate status changes (Active/Inactive)
 */
export const statusValidator = [
  ...paramIdValidator,
  body("status")
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
];

/**
 * Validate publishStatus changes (Published/Draft/Archived)
 */
export const publishStatusValidator = [
  ...paramIdValidator,
  body("publishStatus")
    .isIn(["Published", "Draft", "Archived"])
    .withMessage("Publish Status must be Published, Draft, or Archived"),
];
