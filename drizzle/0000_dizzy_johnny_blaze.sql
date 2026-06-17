CREATE TYPE "public"."blog_category" AS ENUM('novidades', 'curiosidades', 'guias', 'mercado');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'pending_approval', 'published');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('desktop', 'mobile', 'tablet');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('automatic', 'manual', 'quartz');--> statement-breakpoint
CREATE TYPE "public"."watch_condition" AS ENUM('excellent', 'very_good', 'good');--> statement-breakpoint
CREATE TYPE "public"."watch_lead_status" AS ENUM('available', 'sold');--> statement-breakpoint
CREATE TYPE "public"."watch_status" AS ENUM('available', 'sold', 'archived');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"admin_email" text NOT NULL,
	"ip_address" text NOT NULL,
	"user_agent" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"cover_image" text,
	"category" "blog_category" NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"generated_by_ai" boolean DEFAULT false NOT NULL,
	"telegram_message_id" integer,
	"reading_time_minutes" integer DEFAULT 5 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"watch_id" uuid,
	"blog_post_id" uuid,
	"country" text,
	"device_type" "device_type" DEFAULT 'desktop' NOT NULL,
	"session_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watch_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"watch_id" uuid NOT NULL,
	"watch_status_at_time" "watch_lead_status" NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"message" text NOT NULL,
	"notified_telegram" boolean DEFAULT false NOT NULL,
	"notified_email" boolean DEFAULT false NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watch_market_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"reference" text,
	"image_url" text,
	"appreciation_pct" numeric(6, 2) NOT NULL,
	"period" text NOT NULL,
	"editorial_note" text,
	"source" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"reference" text,
	"year" integer,
	"movement_type" "movement_type" NOT NULL,
	"case_material" text,
	"case_diameter_mm" numeric(5, 1),
	"bracelet_material" text,
	"condition" "watch_condition" NOT NULL,
	"has_box" boolean DEFAULT false NOT NULL,
	"has_papers" boolean DEFAULT false NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"status" "watch_status" DEFAULT 'available' NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"image_order" text[] DEFAULT '{}' NOT NULL,
	"external_link" text,
	"sold_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "watches_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_watch_id_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."watches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_leads" ADD CONSTRAINT "watch_leads_watch_id_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."watches"("id") ON DELETE cascade ON UPDATE no action;