import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs, contactMessages } from "@/db/schema";
import { getAuthorizedAdmin, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  try {
    const rows = await getDb().select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(100);
    return Response.json({ messages: rows });
  } catch {
    return Response.json({ messages: [] });
  }
}

export async function PATCH(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  let payload: { id?: number; status?: string };
  try {
    payload = await request.json() as { id?: number; status?: string };
  } catch {
    return Response.json({ error: "Format permintaan tidak valid" }, { status: 400 });
  }
  if (!Number.isInteger(payload.id) || !["unread", "read", "archived"].includes(payload.status || "")) {
    return Response.json({ error: "Invalid message update" }, { status: 400 });
  }
  const db = getDb();
  await db.batch([
    db.update(contactMessages).set({ status: payload.status! }).where(eq(contactMessages.id, payload.id!)),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "update", entity: "message", entityId: String(payload.id) }),
  ]);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Valid message id is required" }, { status: 400 });
  const db = getDb();
  await db.batch([
    db.delete(contactMessages).where(eq(contactMessages.id, id)),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "delete", entity: "message", entityId: String(id) }),
  ]);
  return Response.json({ ok: true });
}
