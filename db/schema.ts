import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  summary: text("summary").notNull(),
  role: text("role").notNull(),
  stackJson: text("stack_json").notNull().default("[]"),
  metric: text("metric"),
  problem: text("problem"),
  solution: text("solution"),
  dataset: text("dataset"),
  method: text("method"),
  evaluation: text("evaluation"),
  galleryJson: text("gallery_json").notNull().default("[]"),
  accent: text("accent").notNull().default("blue"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("draft"),
  coverUrl: text("cover_url"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  linksJson: text("links_json").default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactRateLimits = sqliteTable("contact_rate_limits", {
  fingerprint: text("fingerprint").primaryKey(),
  attempts: integer("attempts").notNull().default(1),
  windowStart: text("window_start").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""),
  url: text("url").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
