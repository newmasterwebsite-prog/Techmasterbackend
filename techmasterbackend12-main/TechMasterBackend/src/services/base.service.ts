import { Document } from "mongoose";
import { IBaseRepository } from "../repositories/base.repository";
import { AppError } from "../middlewares/errorHandler";

export class BaseService<T extends Document> {
  protected repository: IBaseRepository<T>;
  protected modelName: string;

  constructor(repository: IBaseRepository<T>, modelName: string) {
    this.repository = repository;
    this.modelName = modelName;
  }

  async create(data: any, userId?: string): Promise<T> {
    return this.repository.create(data, userId);
  }

  async update(id: string, data: any, userId?: string): Promise<T> {
    const record = await this.repository.update(id, data, userId);
    if (!record) {
      throw new AppError(`${this.modelName} not found or has been deleted`, 404);
    }
    return record;
  }

  async delete(id: string): Promise<T> {
    const record = await this.repository.delete(id);
    if (!record) {
      throw new AppError(`${this.modelName} not found`, 404);
    }
    return record;
  }

  async softDelete(id: string, userId?: string): Promise<T> {
    const record = await this.repository.softDelete(id, userId);
    if (!record) {
      throw new AppError(`${this.modelName} not found or has already been deleted`, 404);
    }
    return record;
  }

  async restore(id: string): Promise<T> {
    const record = await this.repository.restore(id);
    if (!record) {
      throw new AppError(`${this.modelName} not found or is not in deleted state`, 404);
    }
    return record;
  }

  async findAll(filter: any = {}): Promise<T[]> {
    return this.repository.find(filter);
  }

  async findById(id: string): Promise<T> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new AppError(`${this.modelName} not found`, 404);
    }
    return record;
  }

  async updatePublishStatus(
    id: string,
    publishStatus: "Published" | "Draft" | "Archived",
    userId?: string
  ): Promise<T> {
    const record = await this.repository.updatePublishStatus(id, publishStatus, userId);
    if (!record) {
      throw new AppError(`${this.modelName} not found or has been deleted`, 404);
    }
    return record;
  }

  async updateStatus(
    id: string,
    status: "Active" | "Inactive",
    userId?: string
  ): Promise<T> {
    const record = await this.repository.updateStatus(id, status, userId);
    if (!record) {
      throw new AppError(`${this.modelName} not found or has been deleted`, 404);
    }
    return record;
  }
}
