import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// ---- Enums ----
export const watchStatusEnum = pgEnum("watch_status", [
  "available",
  "sold",
  "archived",
]);
export const movementTypeEnum = pgEnum("movement_type", [
  "automatic",
  "manual",
  "quartz",
]);
export const watchConditionEnum = pgEnum("watch_condition", [
  "excellent",
  "very_good",
  "good",
]);
export const blogCategoryEnum = pgEnum("blog_category", [
  "novidades",
  "curiosidades",
  "guias",
  "mercado",
]);
export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "pending_approval",
  "published",
]);
export const deviceTypeEnum = pgEnum("device_type", [
  "desktop",
  "mobile",
  "tablet",
]);
export const watchLeadStatusEnum = pgEnum("watch_lead_status", [
  "available",
  "sold",
]);

// ---- Tables ----

export const watches = pgTable("watches", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  reference: text("reference"),
  year: integer("year"),
  movementType: movementTypeEnum("movement_type").notNull(),
  caseMaterial: text("case_material"),
  caseDiameterMm: decimal("case_diameter_mm", { precision: 5, scale: 1 }),
  braceletMaterial: text("bracelet_material"),
  condition: watchConditionEnum("condition").notNull(),
  hasBox: boolean("has_box").notNull().default(false),
  hasPapers: boolean("has_papers").notNull().default(false),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  status: watchStatusEnum("status").notNull().default("available"),
  featured: boolean("featured").notNull().default(false),
  images: text("images").array().notNull().default([]),
  imageOrder: text("image_order").array().notNull().default([]),
  externalLink: text("external_link"),
  soldAt: timestamp("sold_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image"),
  category: blogCategoryEnum("category").notNull(),
  status: blogStatusEnum("status").notNull().default("draft"),
  generatedByAi: boolean("generated_by_ai").notNull().default(false),
  telegramMessageId: integer("telegram_message_id"),
  readingTimeMinutes: integer("reading_time_minutes").notNull().default(5),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: text("page").notNull(),
  watchId: uuid("watch_id").references(() => watches.id, {
    onDelete: "set null",
  }),
  blogPostId: uuid("blog_post_id").references(() => blogPosts.id, {
    onDelete: "set null",
  }),
  country: text("country"),
  deviceType: deviceTypeEnum("device_type").notNull().default("desktop"),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const watchLeads = pgTable("watch_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  watchId: uuid("watch_id")
    .notNull()
    .references(() => watches.id, { onDelete: "cascade" }),
  watchStatusAtTime: watchLeadStatusEnum("watch_status_at_time").notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  notifiedTelegram: boolean("notified_telegram").notNull().default(false),
  notifiedEmail: boolean("notified_email").notNull().default(false),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  adminEmail: text("admin_email").notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const watchMarketHighlights = pgTable("watch_market_highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  reference: text("reference"),
  imageUrl: text("image_url"),
  appreciationPct: decimal("appreciation_pct", {
    precision: 6,
    scale: 2,
  }).notNull(),
  period: text("period").notNull(),
  editorialNote: text("editorial_note"),
  source: text("source"),
  displayOrder: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
