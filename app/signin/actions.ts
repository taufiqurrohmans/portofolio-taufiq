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

  const rawEmails = typeof env?.ADMIN_EMAILS === "string" ? env.ADMIN_EMAILS : process.env.ADMIN_EMAILS || "";
  const allowedEmails = rawEmails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

  if (!allowedEmails.includes(email.toLowerCase())) {
    return { error: "Invalid admin email or password" };
  }

  const expectedPassword = typeof env?.ADMIN_PASSWORD === "string" ? env.ADMIN_PASSWORD : process.env.ADMIN_PASSWORD || "";
  if (!expectedPassword) {
    return { error: "Server error: ADMIN_PASSWORD is not configured in Cloudflare." };
  }

  if (password !== expectedPassword) {
    return { error: "Invalid admin email or password" };
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
