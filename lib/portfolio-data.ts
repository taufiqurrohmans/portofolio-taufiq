import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects, siteContent } from "@/db/schema";
import { defaultPortfolio, type PortfolioContent, type PortfolioProject } from "@/lib/default-content";

type StoredProject = typeof projects.$inferSelect;

export function projectFromRow(row: StoredProject): PortfolioProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as PortfolioProject["category"],
    year: row.year,
    summary: row.summary,
    role: row.role,
    stack: safeStringArray(row.stackJson),
    metric: row.metric || undefined,
    problem: row.problem || undefined,
    solution: row.solution || undefined,
    dataset: row.dataset || undefined,
    method: row.method || undefined,
    evaluation: row.evaluation || undefined,
    galleryUrls: safeStringArray(row.galleryJson),
    accent: row.accent,
    featured: row.featured,
    status: row.status === "published" ? "published" : "draft",
    coverUrl: row.coverUrl || undefined,
    liveUrl: row.liveUrl || undefined,
    githubUrl: row.githubUrl || undefined,
  };
}

export async function getPortfolioData(): Promise<PortfolioContent> {
  try {
    const db = getDb();
    const [contentRows, projectRows, initializationRows] = await Promise.all([
      db.select().from(siteContent).where(eq(siteContent.key, "portfolio")).limit(1),
      db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt)),
      db.select({ key: siteContent.key }).from(siteContent).where(eq(siteContent.key, "projects_initialized")).limit(1),
    ]);
    const [contentRow] = contentRows;
    const content = contentRow ? safePortfolioContent(contentRow.value) : defaultPortfolio;
    const fallbackProjects = initializationRows.length > 0 ? [] : content.projects;
    return {
      ...content,
      projects: (projectRows.length > 0 ? projectRows.map(projectFromRow) : fallbackProjects)
        .filter((project) => project.status === "published"),
    };
  } catch {
    return {
      ...defaultPortfolio,
      projects: defaultPortfolio.projects.filter((project) => project.status === "published"),
    };
  }
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    const db = getDb();
    const [rows, initialized] = await Promise.all([
      db.select().from(projects).where(eq(projects.slug, slug)).limit(1),
      db.select({ key: siteContent.key }).from(siteContent).where(eq(siteContent.key, "projects_initialized")).limit(1),
    ]);
    const [row] = rows;
    if (row) {
      const project = projectFromRow(row);
      return project.status === "published" ? project : null;
    }
    if (initialized.length > 0) return null;
  } catch {
    // The static samples remain available before the first database migration.
  }
  return defaultPortfolio.projects.find((project) => project.slug === slug && project.status === "published") ?? null;
}

export function publicContentWithoutProjects(content: PortfolioContent) {
  return {
    profile: content.profile,
    stats: content.stats,
    skills: content.skills,
    experience: content.experience,
    certificates: content.certificates,
    gallery: content.gallery || [],
    seo: content.seo,
    socialLinks: content.socialLinks,
  };
}

function safePortfolioContent(value: string): PortfolioContent {
  try {
    const parsed = JSON.parse(value) as PortfolioContent;
    return {
      ...defaultPortfolio,
      ...parsed,
      profile: { ...defaultPortfolio.profile, ...parsed.profile },
      certificates: parsed.certificates ?? defaultPortfolio.certificates,
      gallery: parsed.gallery ?? defaultPortfolio.gallery,
      seo: { ...defaultPortfolio.seo, ...parsed.seo },
    };
  } catch {
    return defaultPortfolio;
  }
}

function safeStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
