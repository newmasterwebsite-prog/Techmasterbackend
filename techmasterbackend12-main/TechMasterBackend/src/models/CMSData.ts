import { Schema, model, Document } from "mongoose";

export interface ICMSData extends Document {
  key: string;
  value: any;
}

const CMSDataSchema = new Schema<ICMSData>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const CMSData = model<ICMSData>("CMSData", CMSDataSchema);
export default CMSData;
