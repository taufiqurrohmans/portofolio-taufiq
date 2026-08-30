"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "cloudflare:workers";

export async function signInAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const returnTo = formData.get("return_to")?.toString() || "/admin";
  
  if (!email) {
    return { error: "Email is required" };
  }

  const rawEmails = typeof env?.ADMIN_EMAILS === "string" ? env.ADMIN_EMAILS : process.env.ADMIN_EMAILS || "";
  const allowedEmails = rawEmails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

  if (!allowedEmails.includes(email.toLowerCase())) {
    return { error: "Invalid admin email" };
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
