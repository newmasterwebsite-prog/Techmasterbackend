import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface IPrivacySection {
  id?: string;
  heading: string;
  description: string;
  order?: number;
  status?: string;
}

export interface IPopupSettings {
  width?: string;
  maxHeight?: string;
  scrollEnable?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  overlayBlur?: boolean;
  bgGlassEffect?: boolean;
  shadowStyle?: string;
  borderRadius?: string;
  animation?: string;
  openTransition?: string;
  closeTransition?: string;
}

export interface ICloseButtonSettings {
  showCloseButton?: boolean;
  position?: string;
  icon?: string;
  size?: string;
  color?: string;
  hoverColor?: string;
}

export interface IPrivacySettings {
  requireAcceptance?: boolean;
  showOnFirstVisit?: boolean;
  showAfterLogin?: boolean;
  showOnRegistration?: boolean;
  cookieConsentIntegration?: boolean;
  autoExpiryReminderDays?: number;
}

export interface IPrivacyAnalytics {
  totalViews?: number;
  acceptanceRate?: string;
  lastUpdated?: string;
  currentVersion?: string;
  mostViewedSection?: string;
}

export interface IPrivacyPolicy extends Document, ICmsBase {
  smallBadge?: string;
  popupTitle?: string;
  effectiveDate?: string;
  lastUpdatedDate?: string;
  versionNumber?: string;
  autoUpdateDate?: boolean;
  introParagraph?: string;
  visibility?: boolean;
  sections?: any[];
  popupSettings?: any;
  closeButtonSettings?: any;
  privacySettings?: any;
  analytics?: any;
  seo?: ISeo;
}

const PrivacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    smallBadge: { type: String, default: "USER PRIVACY" },
    popupTitle: { type: String, default: "Privacy Policy" },
    effectiveDate: { type: String, default: "July 7, 2026" },
    lastUpdatedDate: { type: String, default: "July 7, 2026" },
    versionNumber: { type: String, default: "v2.4" },
    autoUpdateDate: { type: Boolean, default: false },
    introParagraph: { type: String, default: "Aman & Tech Master Media Labs operates this portfolio and education portal. We respect your privacy and only collect direct email addresses when you subscribe to our newsletter." },
    visibility: { type: Boolean, default: true },
    sections: { type: [Schema.Types.Mixed], default: [] },
    popupSettings: { type: Schema.Types.Mixed, default: {} },
    closeButtonSettings: { type: Schema.Types.Mixed, default: {} },
    privacySettings: { type: Schema.Types.Mixed, default: {} },
    analytics: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const PrivacyPolicy = model<IPrivacyPolicy>("PrivacyPolicy", PrivacyPolicySchema);

