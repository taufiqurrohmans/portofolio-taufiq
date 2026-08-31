import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("return_to") || "/";
  
  redirect(returnTo);
}
