import { Schema, model, Document } from "mongoose";
import { SeoSchema, CmsBaseFields, ICmsBase, ISeo } from "./shared";

export interface ITermsSection {
  id?: string;
  title: string;
  body: string;
  order?: number;
  status?: string;
}

export interface ITermsPopupSettings {
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

export interface ITermsCloseButtonSettings {
  showCloseButton?: boolean;
  position?: string;
  icon?: string;
  size?: string;
  color?: string;
  hoverColor?: string;
}

export interface ITermsLegalSettings {
  requireUserAcceptance?: boolean;
  showBeforeRegistration?: boolean;
  showBeforeContactForm?: boolean;
  showBeforeNewsletter?: boolean;
  mandatoryAcceptance?: boolean;
  versionTracking?: boolean;
}

export interface ITermsAnalytics {
  totalViews?: number;
  acceptanceCount?: number;
  currentVersion?: string;
  lastUpdated?: string;
  mostViewedSection?: string;
}

export interface ITermsPolicy extends Document, ICmsBase {
  smallBadge?: string;
  popupTitle?: string;
  effectiveDate?: string;
  lastUpdatedDate?: string;
  versionNumber?: string;
  autoUpdateDate?: boolean;
  subtitle?: string;
  introParagraph?: string;
  visibility?: boolean;
  sections?: any[];
  popupSettings?: any;
  closeButtonSettings?: any;
  legalSettings?: any;
  analytics?: any;
  seo?: ISeo;
}

const TermsPolicySchema = new Schema<ITermsPolicy>(
  {
    smallBadge: { type: String, default: "LEGAL PROTOCOLS" },
    popupTitle: { type: String, default: "Terms of Service" },
    effectiveDate: { type: String, default: "July 7, 2026" },
    lastUpdatedDate: { type: String, default: "July 7, 2026" },
    versionNumber: { type: String, default: "v3.1" },
    autoUpdateDate: { type: Boolean, default: false },
    subtitle: { type: String, default: "TechMaster Terms" },
    introParagraph: { type: String, default: "By browsing this platform, subscribing to our mailing list, or submitting inquiries, you agree to these Terms of Service." },
    visibility: { type: Boolean, default: true },
    sections: { type: [Schema.Types.Mixed], default: [] },
    popupSettings: { type: Schema.Types.Mixed, default: {} },
    closeButtonSettings: { type: Schema.Types.Mixed, default: {} },
    legalSettings: { type: Schema.Types.Mixed, default: {} },
    analytics: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema },
    ...CmsBaseFields,
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const TermsPolicy = model<ITermsPolicy>("TermsPolicy", TermsPolicySchema);

