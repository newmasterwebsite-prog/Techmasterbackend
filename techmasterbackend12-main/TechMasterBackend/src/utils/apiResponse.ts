import { Response } from "express";

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

export class ApiResponse {
  static success<T = any>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response<IApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any
  ): Response<IApiResponse> {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
