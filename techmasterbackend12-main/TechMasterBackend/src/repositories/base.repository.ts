import { Model, Document, Types } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(data: any, userId?: string): Promise<T>;
  update(id: string, data: any, userId?: string): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  softDelete(id: string, userId?: string): Promise<T | null>;
  restore(id: string): Promise<T | null>;
  find(filter?: any): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  updatePublishStatus(id: string, publishStatus: "Published" | "Draft" | "Archived", userId?: string): Promise<T | null>;
  updateStatus(id: string, status: "Active" | "Inactive", userId?: string): Promise<T | null>;
}

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: any, userId?: string): Promise<T> {
    const payload = { ...data };
    if (userId) {
      payload.createdBy = new Types.ObjectId(userId);
      payload.updatedBy = new Types.ObjectId(userId);
    }
    const record = new this.model(payload);
    return record.save();
  }

  async update(id: string, data: any, userId?: string): Promise<T | null> {
    const payload = { ...data };
    if (userId) {
      payload.updatedBy = new Types.ObjectId(userId);
    }
    // Set timestamp and update record
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as any,
      { $set: payload },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async softDelete(id: string, userId?: string): Promise<T | null> {
    const updatePayload: any = { isDeleted: true, deletedAt: new Date() };
    if (userId) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as any,
      { $set: updatePayload },
      { new: true }
    );
  }

  async restore(id: string): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: true } as any,
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    );
  }

  async find(filter: any = {}): Promise<T[]> {
    const query = { ...filter, isDeleted: false };
    return this.model.find(query as any).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findOne({ _id: id, isDeleted: false } as any);
  }

  async updatePublishStatus(
    id: string,
    publishStatus: "Published" | "Draft" | "Archived",
    userId?: string
  ): Promise<T | null> {
    const updatePayload: any = { publishStatus };
    if (userId) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as any,
      { $set: updatePayload },
      { new: true }
    );
  }

  async updateStatus(
    id: string,
    status: "Active" | "Inactive",
    userId?: string
  ): Promise<T | null> {
    const updatePayload: any = { status };
    if (userId) {
      updatePayload.updatedBy = new Types.ObjectId(userId);
    }
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: false } as any,
      { $set: updatePayload },
      { new: true }
    );
  }
}
