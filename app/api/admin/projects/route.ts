import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs, projects, siteContent } from "@/db/schema";
import { getAuthorizedAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { defaultPortfolio } from "@/lib/default-content";
import { projectFromRow } from "@/lib/portfolio-data";
import { projectInputSchema } from "@/lib/validation";

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  try {
    const db = getDb();
    const [rows, initialized] = await Promise.all([
      db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt)),
      db.select({ key: siteContent.key }).from(siteContent).where(eq(siteContent.key, "projects_initialized")).limit(1),
    ]);
    const usingSamples = rows.length === 0 && initialized.length === 0;
    return Response.json({ projects: usingSamples ? defaultPortfolio.projects : rows.map(projectFromRow), usingSamples });
  } catch {
    return Response.json({ projects: defaultPortfolio.projects, usingSamples: true });
  }
}

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Format permintaan tidak valid" }, { status: 400 });
  }
  const parsed = projectInputSchema.safeParse(payload);
  if (!parsed.success) return Response.json({ error: "Data proyek belum valid", issues: parsed.error.flatten() }, { status: 400 });
  const value = parsed.data;
  const db = getDb();
  const [slugOwner] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, value.slug)).limit(1);
  if (slugOwner && slugOwner.id !== value.id) {
    return Response.json({ error: "Slug sudah digunakan proyek lain." }, { status: 409 });
  }
  await db.batch([
    db.insert(projects).values({
      id: value.id,
      slug: value.slug,
      title: value.title,
      category: value.category,
      year: value.year,
      summary: value.summary,
      role: value.role,
      stackJson: JSON.stringify(value.stack),
      metric: value.metric || null,
      problem: value.problem || null,
      solution: value.solution || null,
      dataset: value.dataset || null,
      method: value.method || null,
      evaluation: value.evaluation || null,
      galleryJson: JSON.stringify(value.galleryUrls),
      accent: value.accent,
      featured: value.featured,
      status: value.status,
      coverUrl: value.coverUrl || null,
      liveUrl: value.liveUrl || null,
      githubUrl: value.githubUrl || null,
      linksJson: JSON.stringify(value.links || []),
      sortOrder: value.sortOrder,
    }).onConflictDoUpdate({
      target: projects.id,
      set: {
        slug: value.slug,
        title: value.title,
        category: value.category,
        year: value.year,
        summary: value.summary,
        role: value.role,
        stackJson: JSON.stringify(value.stack),
        metric: value.metric || null,
        problem: value.problem || null,
        solution: value.solution || null,
        dataset: value.dataset || null,
        method: value.method || null,
        evaluation: value.evaluation || null,
        galleryJson: JSON.stringify(value.galleryUrls),
        accent: value.accent,
        featured: value.featured,
        status: value.status,
        coverUrl: value.coverUrl || null,
        liveUrl: value.liveUrl || null,
        githubUrl: value.githubUrl || null,
        linksJson: JSON.stringify(value.links || []),
        sortOrder: value.sortOrder,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    }),
    db.insert(siteContent).values({ key: "projects_initialized", value: "true" })
      .onConflictDoUpdate({ target: siteContent.key, set: { value: "true", updatedAt: sql`CURRENT_TIMESTAMP` } }),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "upsert", entity: "project", entityId: value.id }),
  ]);
  const [row] = await db.select().from(projects).where(eq(projects.id, value.id)).limit(1);
  return Response.json({ project: row ? projectFromRow(row) : value }, { status: 201 });
}

export async function DELETE(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim();
  if (!id) return Response.json({ error: "Project id is required" }, { status: 400 });
  const db = getDb();
  await db.batch([
    db.delete(projects).where(eq(projects.id, id)),
    db.insert(siteContent).values({ key: "projects_initialized", value: "true" })
      .onConflictDoUpdate({ target: siteContent.key, set: { value: "true", updatedAt: sql`CURRENT_TIMESTAMP` } }),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "delete", entity: "project", entityId: id }),
  ]);
  return Response.json({ ok: true });
}
