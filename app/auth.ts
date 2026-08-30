import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "cloudflare:workers";

export type AuthUser = {
  displayName: string;
  email: string;
  fullName: string | null;
};

const USER_EMAIL_HEADERS = [
  "x-authenticated-user-email",
  "oai-authenticated-user-email",
  "x-user-email",
  "x-forwarded-email",
];

const USER_FULL_NAME_HEADERS = [
  "x-authenticated-user-full-name",
  "oai-authenticated-user-full-name",
  "x-user-name",
];

const USER_FULL_NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";
const SIGN_IN_PATH = "/signin";
const SIGN_OUT_PATH = "/signout";
const CALLBACK_PATH = "/callback";

export async function getAuthUser(): Promise<AuthUser | null> {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  
  let email: string | null = cookieStore.get("admin_session")?.value || null;
  
  if (!email) {
    for (const headerName of USER_EMAIL_HEADERS) {
      const value = requestHeaders.get(headerName);
      if (value) {
        email = value;
        break;
      }
    }
  }

  let fullName: string | null = null;
  for (const headerName of USER_FULL_NAME_HEADERS) {
    const value = requestHeaders.get(headerName);
    if (value) {
      const encoding = requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER);
      fullName = encoding === PERCENT_ENCODED_UTF8 ? safeDecodeURIComponent(value) : value;
      break;
    }
  }

  // Local development fallback: if running in dev mode, authenticate as configured admin
  if (!email && (process.env.NODE_ENV === "development" || !process.env.OPENAI_SITE_ID)) {
    const rawEmails = typeof env?.ADMIN_EMAILS === "string" ? env.ADMIN_EMAILS : process.env.ADMIN_EMAILS || "";
    const firstAdmin = rawEmails.split(",").map((e) => e.trim()).filter(Boolean)[0];
    if (firstAdmin) {
      return {
        displayName: "Administrator",
        email: firstAdmin,
        fullName: "Administrator",
      };
    }
  }

  if (!email) return null;

  return {
    displayName: fullName ?? email,
    email,
    fullName,
  };
}

export async function requireAuthUser(returnTo: string): Promise<AuthUser> {
  const user = await getAuthUser();
  if (user) return user;

  redirect(authSignInPath(returnTo));
}

export function authSignInPath(returnTo: string): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `${SIGN_IN_PATH}?return_to=${encodeURIComponent(safeReturnTo)}`;
}

export function authSignOutPath(returnTo = "/"): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `${SIGN_OUT_PATH}?return_to=${encodeURIComponent(safeReturnTo)}`;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  let url: URL;
  try {
    url = new URL(value, "https://app.local");
  } catch {
    return "/";
  }
  if (url.origin !== "https://app.local") return "/";
  if (isReservedAuthPath(url.pathname)) return "/";

  return `${url.pathname}${url.search}${url.hash}`;
}

function isReservedAuthPath(pathname: string): boolean {
  return (
    pathname === SIGN_IN_PATH ||
    pathname === SIGN_OUT_PATH ||
    pathname === CALLBACK_PATH
  );
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
