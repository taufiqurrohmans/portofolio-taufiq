"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "cloudflare:workers";

export async function signInAction(state: any, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const returnTo = formData.get("return_to")?.toString() || "/admin";
  
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const rawEmails = (globalThis as any).__ADMIN_EMAILS || (typeof env?.ADMIN_EMAILS === "string" ? env.ADMIN_EMAILS : process.env.ADMIN_EMAILS) || "";
  const allowedEmails = rawEmails.split(",").map((e: string) => e.trim().toLowerCase()).filter(Boolean);

  const trimmedEmail = email.trim().toLowerCase();

  const expectedPassword = (globalThis as any).__ADMIN_PASSWORD || (typeof env?.ADMIN_PASSWORD === "string" ? env.ADMIN_PASSWORD : process.env.ADMIN_PASSWORD) || "";

  if (!allowedEmails.includes(trimmedEmail)) {
    return { error: `Debug: ADMIN_EMAILS="${rawEmails}", ADMIN_PASSWORD="${expectedPassword ? 'SET' : 'MISSING'}"` };
  }

  if (!expectedPassword) {
    return { error: "Server error: ADMIN_PASSWORD is not configured in Cloudflare." };
  }

  if (password !== expectedPassword) {
    return { error: "Invalid password for this account." };
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", email.toLowerCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect(returnTo);
}
