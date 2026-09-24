import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse";

/**
 * Validator helper middleware: checks if there are express-validation errors
 * and halts execution returning formatted validation errors.
 */
export const validateResult = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ApiResponse.error(res, "Validation failed", 400, errors.array());
    return;
  }
  next();
};
