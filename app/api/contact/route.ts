import { lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contactMessages, contactRateLimits } from "@/db/schema";
import { contactInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Format permintaan tidak valid" }, { status: 400 });
  }

  const parsed = contactInputSchema.safeParse(payload);
  if (!parsed.success || parsed.data.company) {
    return Response.json({ error: "Pesan belum valid" }, { status: 400 });
  }

  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / 3_600_000) * 3_600_000);
  const expiresAt = new Date(windowStart.getTime() + 3_600_000);
  const fingerprint = await createRateLimitFingerprint(request, windowStart.toISOString());
  const db = getDb();
  const [rateLimit] = await db.select().from(contactRateLimits).where(sql`${contactRateLimits.fingerprint} = ${fingerprint}`).limit(1);
  if (rateLimit && rateLimit.attempts >= 5) {
    return Response.json(
      { error: "Terlalu banyak pesan. Coba lagi dalam satu jam." },
      { status: 429, headers: { "retry-after": String(Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000))) } },
    );
  }

  await db.batch([
    db.delete(contactRateLimits).where(lt(contactRateLimits.expiresAt, now.toISOString())),
    db.insert(contactRateLimits).values({
      fingerprint,
      attempts: 1,
      windowStart: windowStart.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }).onConflictDoUpdate({
      target: contactRateLimits.fingerprint,
      set: { attempts: sql`${contactRateLimits.attempts} + 1` },
    }),
    db.insert(contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    }),
  ]);
  return Response.json({ ok: true }, { status: 201 });
}

async function createRateLimitFingerprint(request: Request, window: string) {
  const forwardedFor = request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 160) || "unknown";
  const source = new TextEncoder().encode(`${forwardedFor}|${userAgent}|${window}`);
  const digest = await crypto.subtle.digest("SHA-256", source);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
