export type ID = string;

export interface Announcement {
  id: ID;
  title: string;
  body: string;
  published: boolean;
  createdAt: number;
}

export interface EventRegistration {
  id: ID;
  name: string;
  email: string;
  paid: boolean;
  amount?: number;
  createdAt: number;
}

export interface EventItem {
  id: ID;
  title: string;
  description: string;
  date: string; // ISO date
  location: string;
  registrations: EventRegistration[];
  createdAt: number;
}

export interface FileAsset {
  id: ID;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 preview
  uploadedAt: number;
}

export interface MessageTemplate {
  id: ID;
  name: string;
  channel: "email" | "sms" | "push";
  subject?: string;
  content: string;
  createdAt: number;
}

export interface ModerationItem {
  id: ID;
  type: "post" | "comment";
  author: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export interface MentorshipConnection {
  id: ID;
  mentor: string;
  mentee: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export interface SurveyQuestion {
  id: ID;
  text: string;
  type: "text" | "single" | "multi";
  options?: string[];
}

export interface Survey {
  id: ID;
  title: string;
  active: boolean;
  questions: SurveyQuestion[];
  createdAt: number;
}

export interface AuditLogEntry {
  id: ID;
  actor: string; // admin email
  action: string;
  details?: string;
  at: number;
  ip?: string;
}

export interface Donation {
  id: ID;
  donor: string;
  email?: string;
  amount: number;
  campaign?: string;
  createdAt: number;
}

export interface Sponsorship {
  id: ID;
  sponsor: string;
  amount: number;
  package: string;
  createdAt: number;
}

export interface TicketSale {
  id: ID;
  eventId: ID;
  buyer: string;
  email?: string;
  quantity: number;
  total: number;
  paid: boolean;
  createdAt: number;
}

export interface BrandingSettings {
  logoDataUrl?: string;
  primaryColor?: string;
  bannerText?: string;
}

export interface CustomField {
  id: ID;
  entity: "profile";
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
}

export interface IntegrationSettings {
  paymentGatewayKey?: string;
  emailServiceKey?: string;
  ssoProvider?: string;
  apiKeys?: { name: string; key: string }[];
}

export interface SecuritySettings {
  enforceMFA: boolean;
  loginRestrictions?: {
    ipAllowList?: string[];
    regionsAllowList?: string[];
  };
}

export interface Notice {
  id: ID;
  title: string;
  message: string;
  createdAt: number;
}

export interface FeedbackItem {
  id: ID;
  user?: string;
  category: string;
  message: string;
  createdAt: number;
}

export interface HelpdeskTicket {
  id: ID;
  user?: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: number;
}

export interface AdminStore {
  announcements: Announcement[];
  events: EventItem[];
  files: FileAsset[];
  templates: MessageTemplate[];
  moderation: ModerationItem[];
  mentorship: MentorshipConnection[];
  surveys: Survey[];
  audit: AuditLogEntry[];
  donations: Donation[];
  sponsorships: Sponsorship[];
  tickets: TicketSale[];
  notices: Notice[];
  feedback: FeedbackItem[];
  helpdesk: HelpdeskTicket[];
  branding: BrandingSettings;
  customFields: CustomField[];
  integrations: IntegrationSettings;
  security: SecuritySettings;
}
