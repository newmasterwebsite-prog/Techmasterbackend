import { Schema, model, Document } from "mongoose";
import { CmsBaseFields, ICmsBase } from "./shared";

export interface ILegalSettings extends Document, ICmsBase {
  showTerms: boolean;
  showPrivacy: boolean;
  showCookiePolicy: boolean;
  enablePopup: boolean;
  popupAnimation: string;
  blurBackground: boolean;
  closeOnOutsideClick: boolean;
  showLastUpdated: boolean;
  popupWidth: string;
  theme: string;
  overlayOpacity: number;
  order?: number;
}

const LegalSettingsSchema = new Schema<ILegalSettings>(
  {
    showTerms: { type: Boolean, default: true },
    showPrivacy: { type: Boolean, default: true },
    showCookiePolicy: { type: Boolean, default: true },
    enablePopup: { type: Boolean, default: true },
    popupAnimation: { type: String, default: "fade" },
    blurBackground: { type: Boolean, default: true },
    closeOnOutsideClick: { type: Boolean, default: true },
    showLastUpdated: { type: Boolean, default: true },
    popupWidth: { type: String, default: "max-w-2xl" },
    theme: { type: String, default: "dark" },
    overlayOpacity: { type: Number, default: 80 },
    order: { type: Number, default: 1 },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
  }
);

export const LegalSettings = model<ILegalSettings>("LegalSettings", LegalSettingsSchema);
