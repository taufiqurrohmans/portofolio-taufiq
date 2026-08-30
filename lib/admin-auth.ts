import { env } from "cloudflare:workers";
import { getAuthUser, requireAuthUser } from "@/app/auth";

function allowedEmails(): string[] {
  const raw = typeof env.ADMIN_EMAILS === "string" ? env.ADMIN_EMAILS : "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminPage(returnTo = "/admin") {
  const user = await requireAuthUser(returnTo);
  const allowlist = allowedEmails();
  if (allowlist.length === 0 || !allowlist.includes(user.email.toLowerCase())) {
    return null;
  }
  return user;
}

export async function getAuthorizedAdmin() {
  const user = await getAuthUser();
  if (!user) return null;
  const allowlist = allowedEmails();
  if (allowlist.length === 0 || !allowlist.includes(user.email.toLowerCase())) return null;
  return user;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

