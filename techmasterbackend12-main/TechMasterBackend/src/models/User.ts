import { Schema, model, Document } from "mongoose";
import { MediaSchema, IMedia } from "./shared";
import { hashPassword } from "../helpers/encryption";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: "Super Admin" | "Admin" | "Editor" | "Viewer";
  profileImage?: IMedia;
  status: "Active" | "Inactive";
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  lastLogin?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phoneNumber: { type: String, trim: true },
    password: { type: String, select: false }, // Keep hidden unless explicitly selected
    role: {
      type: String,
      required: true,
      enum: ["Super Admin", "Admin", "Editor", "Viewer"],
      default: "Viewer",
    },
    profileImage: { type: MediaSchema },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    lastLogin: { type: Date },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if it has been modified
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = model<IUser>("User", UserSchema);
