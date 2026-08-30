import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs, contactMessages, mediaAssets, projects } from "@/db/schema";
import { getAuthorizedAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { defaultPortfolio } from "@/lib/default-content";

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  try {
    const db = getDb();
    const [projectCount, publishedCount, unreadCount, mediaCount, recent] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(projects),
      db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, "published")),
      db.select({ count: sql<number>`count(*)` }).from(contactMessages).where(eq(contactMessages.status, "unread")),
      db.select({ count: sql<number>`count(*)` }).from(mediaAssets),
      db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
    ]);
    return Response.json({
      counts: {
        projects: projectCount[0]?.count || 0,
        published: publishedCount[0]?.count || 0,
        unread: unreadCount[0]?.count || 0,
        media: mediaCount[0]?.count || 0,
      },
      recent,
    });
  } catch {
    return Response.json({
      counts: {
        projects: defaultPortfolio.projects.length,
        published: defaultPortfolio.projects.filter(p => p.status === "published").length,
        unread: 0,
        media: 0,
      },
      recent: [],
    });
  }
}
