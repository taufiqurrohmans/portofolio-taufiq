import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { auditLogs, mediaAssets, projects, siteContent } from "@/db/schema";
import { getAuthorizedAdmin, unauthorizedResponse } from "@/lib/admin-auth";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["application/pdf", "pdf"],
]);
const maxBytes = 8 * 1024 * 1024;

export async function GET() {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  try {
    const rows = await getDb().select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(100);
    return Response.json({ media: rows });
  } catch {
    return Response.json({ media: [] });
  }
}

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  if (!env.BUCKET) return Response.json({ error: "Media storage is unavailable" }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  const altText = String(form.get("altText") || "").trim().slice(0, 180);
  if (!(file instanceof File)) return Response.json({ error: "File is required" }, { status: 400 });
  if (!allowedTypes.has(file.type)) return Response.json({ error: "Gunakan JPG, PNG, WebP, AVIF, atau PDF" }, { status: 415 });
  if (file.size > maxBytes) return Response.json({ error: "Ukuran maksimal file adalah 8 MB" }, { status: 413 });
  if (file.type.startsWith("image/") && !altText) return Response.json({ error: "Alt text wajib diisi untuk gambar" }, { status: 400 });

  const extension = allowedTypes.get(file.type)!;
  const key = `portfolio/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  const url = `/media/${key}`;
  const db = getDb();
  const [asset] = await db.insert(mediaAssets).values({ key, filename: file.name, contentType: file.type, size: file.size, altText, url }).returning();
  await db.insert(auditLogs).values({ actorEmail: admin.email, action: "upload", entity: "media", entityId: String(asset.id) });
  return Response.json({ asset }, { status: 201 });
}

export async function DELETE(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) return unauthorizedResponse();
  if (!env.BUCKET) return Response.json({ error: "Media storage is unavailable" }, { status: 503 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Valid media id is required" }, { status: 400 });
  const db = getDb();
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return Response.json({ error: "Media not found" }, { status: 404 });
  const [contentRows, projectRows] = await Promise.all([
    db.select({ value: siteContent.value }).from(siteContent),
    db.select({ coverUrl: projects.coverUrl, galleryJson: projects.galleryJson }).from(projects),
  ]);
  const isReferenced = contentRows.some((row) => row.value.includes(asset.url))
    || projectRows.some((row) => row.coverUrl === asset.url || row.galleryJson.includes(asset.url));
  if (isReferenced) {
    return Response.json({ error: "Media masih digunakan oleh konten atau proyek." }, { status: 409 });
  }
  await env.BUCKET.delete(asset.key);
  await db.batch([
    db.delete(mediaAssets).where(eq(mediaAssets.id, id)),
    db.insert(auditLogs).values({ actorEmail: admin.email, action: "delete", entity: "media", entityId: String(id) }),
  ]);
  return Response.json({ ok: true });
}
