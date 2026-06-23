import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export function isAdminAuthenticated(request?: NextRequest): boolean {
  try {
    if (request) {
      const token = request.cookies.get("admin_token")?.value;
      return token === process.env.ADMIN_PASSWORD;
    }
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;
    return token === process.env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}
