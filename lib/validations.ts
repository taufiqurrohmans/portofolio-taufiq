import { z } from "zod";

// --- Form Profile & SEO ---
export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  initials: z.string().min(1, "Inisial wajib diisi").max(5, "Inisial maksimal 5 karakter"),
  headline: z.string().min(5, "Headline minimal 5 karakter").max(200, "Headline maksimal 200 karakter"),
  subheadline: z.string().max(200, "Subheadline maksimal 200 karakter"),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  email: z.string().email("Format email tidak valid"),
  location: z.string().min(2, "Lokasi wajib diisi"),
  university: z.string().min(2, "Universitas wajib diisi"),
  program: z.string().min(2, "Program studi wajib diisi"),
  availability: z.string().min(2, "Ketersediaan wajib diisi"),
  photoUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  cvUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
});

export const seoSchema = z.object({
  title: z.string().min(5, "SEO Title minimal 5 karakter").max(100, "SEO Title maksimal 100 karakter"),
  description: z.string().min(10, "SEO Description minimal 10 karakter").max(300, "SEO Description maksimal 300 karakter"),
  keywords: z.string().min(2, "Keywords wajib diisi"),
  ogImageUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
});

// --- Form Stats & Skills ---
export const statSchema = z.object({
  value: z.string().min(1, "Nilai wajib diisi"),
  label: z.string().min(2, "Label wajib diisi"),
});

export const skillSchema = z.object({
  name: z.string().min(2, "Nama skill wajib diisi"),
  group: z.string().min(2, "Grup skill wajib diisi"),
  level: z.string().min(2, "Level skill wajib diisi"),
});

// --- Form Experience & Certificate ---
export const experienceSchema = z.object({
  period: z.string().min(2, "Periode wajib diisi"),
  title: z.string().min(2, "Posisi wajib diisi"),
  organization: z.string().min(2, "Organisasi wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul sertifikat wajib diisi"),
  issuer: z.string().min(2, "Penerbit wajib diisi"),
  year: z.string().min(4, "Tahun wajib diisi"),
  credentialUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  imageUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
});

// --- Form Project ---
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Nama proyek wajib diisi").max(150, "Nama proyek terlalu panjang"),
  slug: z.string().min(2, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip (-) tanpa spasi"),
  category: z.string().min(2, "Kategori wajib dipilih"),
  year: z.string().min(4, "Tahun wajib diisi"),
  summary: z.string().min(10, "Ringkasan minimal 10 karakter").max(500, "Ringkasan maksimal 500 karakter"),
  role: z.string().min(2, "Peran wajib diisi"),
  stack: z.array(z.string()).min(1, "Minimal satu teknologi digunakan"),
  metric: z.string().optional().or(z.literal("")),
  problem: z.string().optional().or(z.literal("")),
  solution: z.string().optional().or(z.literal("")),
  dataset: z.string().optional().or(z.literal("")),
  method: z.string().optional().or(z.literal("")),
  evaluation: z.string().optional().or(z.literal("")),
  galleryUrls: z.array(z.string()).optional(),
  accent: z.string().min(2, "Aksen warna wajib dipilih"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
  coverUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  liveUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  githubUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  links: z.array(z.any()).optional(), // Akan menggunakan multiLinkSchema
});

// --- Form Multi-Link & Gallery ---
export const multiLinkSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    "Live Demo", "GitHub", "Repository", "Dokumentasi", "Case Study", 
    "Figma", "Canva", "YouTube", "Google Drive", "LinkedIn", 
    "Credential", "Download", "Website", "Custom Link"
  ]),
  label: z.string().min(2, "Label wajib diisi"),
  url: z.string().url("Format URL tidak valid (harus memakai https://)"),
  isActive: z.boolean().default(true),
  openInNewTab: z.boolean().default(true),
});

export const galleryItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul wajib diisi"),
  subtitle: z.string().optional(),
  imageUrl: z.string().url("Format URL gambar tidak valid").or(z.literal("")),
  flag: z.string().optional(),
});

// --- Types ---
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SeoFormValues = z.infer<typeof seoSchema>;
export type StatFormValues = z.infer<typeof statSchema>;
export type SkillFormValues = z.infer<typeof skillSchema>;
export type ExperienceFormValues = z.infer<typeof experienceSchema>;
export type CertificateFormValues = z.infer<typeof certificateSchema>;
export type ProjectFormValues = z.infer<typeof projectSchema>;
export type MultiLinkValues = z.infer<typeof multiLinkSchema>;
export type GalleryItemValues = z.infer<typeof galleryItemSchema>;
