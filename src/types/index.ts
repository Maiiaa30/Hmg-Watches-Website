export type WatchStatus = "available" | "sold" | "archived";
export type MovementType = "automatic" | "manual" | "quartz";
export type WatchCondition = "excellent" | "very_good" | "good";
export type BlogCategory = "novidades" | "curiosidades" | "guias" | "mercado";
export type BlogStatus = "draft" | "pending_approval" | "published";
export type DeviceType = "desktop" | "mobile" | "tablet";

export interface Watch {
  id: string;
  slug: string;
  brand: string;
  model: string;
  reference: string | null;
  year: number | null;
  movementType: MovementType;
  caseMaterial: string | null;
  caseDiameterMm: string | null;
  braceletMaterial: string | null;
  condition: WatchCondition;
  hasBox: boolean;
  hasPapers: boolean;
  description: string | null;
  price: string;
  status: WatchStatus;
  featured: boolean;
  images: string[];
  imageOrder: string[];
  externalLink: string | null;
  soldAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  category: BlogCategory;
  status: BlogStatus;
  generatedByAi: boolean;
  telegramMessageId: number | null;
  readingTimeMinutes: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchLead {
  id: string;
  watchId: string;
  watchStatusAtTime: "available" | "sold";
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  notifiedTelegram: boolean;
  notifiedEmail: boolean;
  read: boolean;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface WatchMarketHighlight {
  id: string;
  brand: string;
  model: string;
  reference: string | null;
  imageUrl: string | null;
  appreciationPct: string;
  period: string;
  editorialNote: string | null;
  source: string | null;
  displayOrder: number;
  active: boolean;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  adminEmail: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface PageView {
  id: string;
  page: string;
  watchId: string | null;
  blogPostId: string | null;
  country: string | null;
  deviceType: DeviceType;
  sessionId: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
