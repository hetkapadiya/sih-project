import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  AdminStore,
  Announcement,
  EventItem,
  FileAsset,
  MessageTemplate,
  ModerationItem,
  MentorshipConnection,
  Survey,
  AuditLogEntry,
  Donation,
  Sponsorship,
  TicketSale,
  BrandingSettings,
  CustomField,
  IntegrationSettings,
  SecuritySettings,
} from "./types";

const KEY = "alumnihub_admin_store_v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const defaultStore: AdminStore = {
  announcements: [],
  events: [],
  files: [],
  templates: [],
  moderation: [],
  mentorship: [],
  surveys: [],
  audit: [],
  donations: [],
  sponsorships: [],
  tickets: [],
  notices: [],
  feedback: [],
  helpdesk: [],
  branding: { bannerText: "Welcome to the Admin Panel" },
  customFields: [],
  integrations: {},
  security: { enforceMFA: false, loginRestrictions: {} },
};

export function loadStore(): AdminStore {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultStore;
  try {
    const parsed = JSON.parse(raw) as AdminStore;
    return { ...defaultStore, ...parsed };
  } catch {
    return defaultStore;
  }
}

export function saveStore(store: AdminStore) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function withStore<T>(fn: (s: AdminStore) => T): T {
  const s = loadStore();
  const res = fn(s);
  saveStore(s);
  return res;
}

export function logAudit(actor: string, action: string, details?: string) {
  withStore((s) => {
    const e: AuditLogEntry = { id: uid(), actor, action, details, at: Date.now(), ip: undefined };
    s.audit.unshift(e);
    return e;
  });
}

export function exportCSV(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.map((v) => formatCSVCell(v)).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatCSVCell(v: any) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

export function exportPDF(title: string, columns: string[], data: (string | number | boolean | null | undefined)[][]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 40, 40);
  autoTable(doc, {
    head: [columns],
    body: data.map((r) => r.map((v) => (v == null ? "" : String(v)))),
    startY: 60,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 41, 59] },
  });
  doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// CRUD helpers for common entities used by sections
export const AdminAPI = {
  addAnnouncement(a: Omit<Announcement, "id" | "createdAt">) {
    return withStore((s) => {
      const item: Announcement = { id: uid(), createdAt: Date.now(), ...a };
      s.announcements.unshift(item);
      return item;
    });
  },
  updateAnnouncement(id: string, patch: Partial<Announcement>) {
    return withStore((s) => {
      const i = s.announcements.findIndex((x) => x.id === id);
      if (i >= 0) s.announcements[i] = { ...s.announcements[i], ...patch };
      return s.announcements[i];
    });
  },
  removeAnnouncement(id: string) {
    return withStore((s) => {
      s.announcements = s.announcements.filter((x) => x.id !== id);
    });
  },

  addEvent(e: Omit<EventItem, "id" | "createdAt" | "registrations">) {
    return withStore((s) => {
      const item: EventItem = { id: uid(), createdAt: Date.now(), registrations: [], ...e };
      s.events.unshift(item);
      return item;
    });
  },
  addRegistration(eventId: string, r: Omit<EventRegistration, "id" | "createdAt">) {
    return withStore((s) => {
      const ev = s.events.find((x) => x.id === eventId);
      if (!ev) return;
      ev.registrations.unshift({ id: uid(), createdAt: Date.now(), ...r });
      return ev;
    });
  },
  removeEvent(id: string) {
    return withStore((s) => {
      s.events = s.events.filter((x) => x.id !== id);
    });
  },

  addFile(f: Omit<FileAsset, "id" | "uploadedAt">) {
    return withStore((s) => {
      const item: FileAsset = { id: uid(), uploadedAt: Date.now(), ...f };
      s.files.unshift(item);
      return item;
    });
  },
  removeFile(id: string) {
    return withStore((s) => {
      s.files = s.files.filter((x) => x.id !== id);
    });
  },

  addTemplate(t: Omit<MessageTemplate, "id" | "createdAt">) {
    return withStore((s) => {
      const item: MessageTemplate = { id: uid(), createdAt: Date.now(), ...t };
      s.templates.unshift(item);
      return item;
    });
  },
  removeTemplate(id: string) {
    return withStore((s) => {
      s.templates = s.templates.filter((x) => x.id !== id);
    });
  },

  addModeration(m: Omit<ModerationItem, "id" | "createdAt" | "status">) {
    return withStore((s) => {
      const item: ModerationItem = { id: uid(), createdAt: Date.now(), status: "pending", ...m };
      s.moderation.unshift(item);
      return item;
    });
  },
  setModeration(id: string, status: ModerationItem["status"]) {
    return withStore((s) => {
      const i = s.moderation.findIndex((x) => x.id === id);
      if (i >= 0) s.moderation[i].status = status;
    });
  },

  addMentorship(m: Omit<MentorshipConnection, "id" | "createdAt" | "status">) {
    return withStore((s) => {
      const item: MentorshipConnection = { id: uid(), createdAt: Date.now(), status: "pending", ...m };
      s.mentorship.unshift(item);
      return item;
    });
  },
  setMentorship(id: string, status: MentorshipConnection["status"]) {
    return withStore((s) => {
      const i = s.mentorship.findIndex((x) => x.id === id);
      if (i >= 0) s.mentorship[i].status = status;
    });
  },

  addSurvey(sv: Omit<Survey, "id" | "createdAt">) {
    return withStore((s) => {
      const item: Survey = { id: uid(), createdAt: Date.now(), ...sv };
      s.surveys.unshift(item);
      return item;
    });
  },
  removeSurvey(id: string) {
    return withStore((s) => {
      s.surveys = s.surveys.filter((x) => x.id !== id);
    });
  },

  addDonation(d: Omit<Donation, "id" | "createdAt">) {
    return withStore((s) => {
      const item: Donation = { id: uid(), createdAt: Date.now(), ...d };
      s.donations.unshift(item);
      return item;
    });
  },
  addSponsorship(sp: Omit<Sponsorship, "id" | "createdAt">) {
    return withStore((s) => {
      const item: Sponsorship = { id: uid(), createdAt: Date.now(), ...sp };
      s.sponsorships.unshift(item);
      return item;
    });
  },
  addTicket(tk: Omit<TicketSale, "id" | "createdAt">) {
    return withStore((s) => {
      const item: TicketSale = { id: uid(), createdAt: Date.now(), ...tk };
      s.tickets.unshift(item);
      return item;
    });
  },

  setBranding(b: Partial<BrandingSettings>) {
    return withStore((s) => {
      s.branding = { ...s.branding, ...b };
      applyBranding(s.branding);
      return s.branding;
    });
  },
  setIntegrations(i: Partial<IntegrationSettings>) {
    return withStore((s) => {
      s.integrations = { ...s.integrations, ...i };
      return s.integrations;
    });
  },
  setSecurity(sec: Partial<SecuritySettings>) {
    return withStore((s) => {
      s.security = { ...s.security, ...sec, loginRestrictions: { ...s.security.loginRestrictions, ...sec.loginRestrictions } };
      return s.security;
    });
  },
};

export function applyBranding(branding: BrandingSettings) {
  const root = document.documentElement;
  if (branding.primaryColor) {
    root.style.setProperty("--primary", branding.primaryColor);
  }
}

export function getBackupJSON(): string {
  return JSON.stringify(loadStore());
}

export function restoreFromJSON(json: string) {
  const parsed = JSON.parse(json) as AdminStore;
  saveStore(parsed);
}
