import { Response, NextFunction } from "express";
import { Document } from "mongoose";
import { BaseService } from "../services/base.service";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../middlewares/auth";

export class BaseController<T extends Document> {
  protected service: BaseService<T>;
  protected modelName: string;

  constructor(service: BaseService<T>, modelName: string) {
    this.service = service;
    this.modelName = modelName;

    // Bind all methods to 'this'
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.softDelete = this.softDelete.bind(this);
    this.restore = this.restore.bind(this);
    this.publish = this.publish.bind(this);
    this.unpublish = this.unpublish.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await this.service.findAll({});
      ApiResponse.success(res, `${this.modelName}s retrieved successfully`, records);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await this.service.findById(req.params.id);
      ApiResponse.success(res, `${this.modelName} retrieved successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const record = await this.service.create(req.body, userId);
      ApiResponse.success(res, `${this.modelName} created successfully`, record, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const record = await this.service.update(req.params.id, req.body, userId);
      ApiResponse.success(res, `${this.modelName} updated successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.service.delete(req.params.id);
      ApiResponse.success(res, `${this.modelName} hard-deleted successfully`);
    } catch (error) {
      next(error);
    }
  }

  async softDelete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const record = await this.service.softDelete(req.params.id, userId);
      ApiResponse.success(res, `${this.modelName} soft-deleted successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async restore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await this.service.restore(req.params.id);
      ApiResponse.success(res, `${this.modelName} restored successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async publish(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const record = await this.service.updatePublishStatus(req.params.id, "Published", userId);
      ApiResponse.success(res, `${this.modelName} published successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async unpublish(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const record = await this.service.updatePublishStatus(req.params.id, "Draft", userId);
      ApiResponse.success(res, `${this.modelName} unpublished successfully`, record);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { status } = req.body;
      if (status !== "Active" && status !== "Inactive") {
        ApiResponse.error(res, "Invalid status. Must be Active or Inactive", 400);
        return;
      }
      const record = await this.service.updateStatus(req.params.id, status, userId);
      ApiResponse.success(res, `${this.modelName} status updated successfully`, record);
    } catch (error) {
      next(error);
    }
  }
}
