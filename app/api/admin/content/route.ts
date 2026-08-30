import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs, siteContent } from "@/db/schema";
import { getAuthorizedAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getPortfolioData, publicContentWithoutProjects } from "@/lib/portfolio-data";
import { contentInputSchema } from "@/lib/validation";

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  const content = await getPortfolioData();
  return Response.json(publicContentWithoutProjects(content));
}

export async function PUT(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Format permintaan tidak valid" }, { status: 400 });
  }
  const parsed = contentInputSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "Data profil belum valid", issues: parsed.error.flatten() }, { status: 400 });
  }
  const db = getDb();
  await db.batch([
    db.insert(siteContent).values({ key: "portfolio", value: JSON.stringify({ ...parsed.data, projects: [] }) })
      .onConflictDoUpdate({ target: siteContent.key, set: { value: JSON.stringify({ ...parsed.data, projects: [] }), updatedAt: sql`CURRENT_TIMESTAMP` } }),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "update", entity: "site_content", entityId: "portfolio" }),
  ]);
  const [row] = await db.select().from(siteContent).where(eq(siteContent.key, "portfolio")).limit(1);
  return Response.json({ ok: true, updatedAt: row?.updatedAt });
}
