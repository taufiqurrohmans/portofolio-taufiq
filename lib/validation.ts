import { z } from "zod";

function isSafeRelativeUrl(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return false;
  const path = value.split(/[?#]/, 1)[0];
  return !path.split("/").some((segment) => segment === "." || segment === "..");
}

const webOrAssetUrl = z.string().trim().refine((value) => {
  if (isSafeRelativeUrl(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Gunakan URL HTTPS atau path aset yang diawali /.");

const safeUrl = z.union([z.literal(""), webOrAssetUrl]).optional();

const socialUrl = z.string().trim().refine((value) => {
  try {
    return ["https:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "Gunakan URL HTTPS atau mailto.");

export const projectInputSchema = z.object({
  id: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  title: z.string().trim().min(2).max(120),
  category: z.enum(["AI / ML", "Computer Vision", "NLP", "Web Development"]),
  year: z.string().trim().min(4).max(20),
  summary: z.string().trim().min(20).max(900),
  role: z.string().trim().min(2).max(120),
  stack: z.array(z.string().trim().min(1).max(40)).max(20),
  metric: z.string().trim().max(180).optional().default(""),
  problem: z.string().trim().max(2500).optional().default(""),
  solution: z.string().trim().max(2500).optional().default(""),
  dataset: z.string().trim().max(2500).optional().default(""),
  method: z.string().trim().max(2500).optional().default(""),
  evaluation: z.string().trim().max(2500).optional().default(""),
  galleryUrls: z.array(webOrAssetUrl).max(20).default([]),
  accent: z.enum(["blue", "violet", "lime"]).default("blue"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  coverUrl: safeUrl,
  liveUrl: safeUrl,
  githubUrl: safeUrl,
  links: z.array(z.object({
    id: z.string(),
    type: z.string(),
    label: z.string(),
    url: safeUrl,
    isActive: z.boolean(),
    openInNewTab: z.boolean(),
  })).optional().default([]),
  sortOrder: z.number().int().min(0).max(999).default(0),
});

export const contentInputSchema = z.object({
  profile: z.object({
    name: z.string().trim().min(2).max(100),
    initials: z.string().trim().min(1).max(4),
    headline: z.string().trim().min(2).max(120),
    subheadline: z.string().trim().min(2).max(180),
    bio: z.string().trim().min(20).max(1200),
    email: z.string().email(),
    location: z.string().trim().min(2).max(120),
    university: z.string().trim().min(2).max(180),
    program: z.string().trim().min(2).max(180),
    availability: z.string().trim().min(2).max(180),
    photoUrl: safeUrl,
    cvUrl: safeUrl,
  }),
  stats: z.array(z.object({ value: z.string().trim().min(1).max(20), label: z.string().trim().min(1).max(80) })).max(8),
  skills: z.array(z.object({ name: z.string().trim().min(1).max(60), group: z.string().trim().min(1).max(80), level: z.string().trim().min(1).max(80) })).max(40),
  experience: z.array(z.object({
    period: z.string().trim().min(1).max(60),
    title: z.string().trim().min(2).max(120),
    organization: z.string().trim().min(2).max(150),
    description: z.string().trim().min(10).max(700),
  })).max(30),
  certificates: z.array(z.object({
    id: z.string().min(1).max(80),
    title: z.string().min(2).max(180),
    issuer: z.string().min(2).max(150),
    year: z.string().min(4).max(20),
    credentialUrl: safeUrl,
    imageUrl: safeUrl,
  })).max(40),
  gallery: z.array(z.object({
    id: z.string().min(1).max(80),
    title: z.string().min(1).max(180),
    subtitle: z.string().max(250).optional().default(""),
    imageUrl: webOrAssetUrl,
    flag: z.string().max(20).optional().default(""),
  })).max(50).optional().default([]),
  seo: z.object({
    title: z.string().min(10).max(70),
    description: z.string().min(50).max(180),
    keywords: z.string().max(400),
    ogImageUrl: safeUrl,
  }),
  socialLinks: z.array(z.object({ label: z.string().trim().min(2).max(40), href: socialUrl })).max(12),
});

export const contactInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(180),
  message: z.string().trim().min(10).max(2500),
  company: z.string().max(0).optional(),
});
