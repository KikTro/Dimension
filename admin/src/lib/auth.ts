import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dimension2026";
const SESSION_COOKIE_NAME = "dimension_admin_session";
const SESSION_SECRET_TOKEN = process.env.ADMIN_SECRET_KEY || "dim_sec_auth_key_kiktro_2026";

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createAdminSessionToken(): string {
  // Simple deterministic session token for local/standalone admin auth
  return Buffer.from(`${SESSION_SECRET_TOKEN}:${Date.now()}`).toString("base64");
}

export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (!session || !session.value) return false;
    
    const decoded = Buffer.from(session.value, "base64").toString("utf-8");
    return decoded.startsWith(SESSION_SECRET_TOKEN);
  } catch (err) {
    return false;
  }
}

export function verifyAdminApi(request: Request): boolean {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    if (cookieHeader.includes(`${SESSION_COOKIE_NAME}=`)) {
      const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match && match[1]) {
        const decoded = Buffer.from(decodeURIComponent(match[1]), "base64").toString("utf-8");
        if (decoded.startsWith(SESSION_SECRET_TOKEN)) return true;
      }
    }

    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ") && authHeader.replace("Bearer ", "") === SESSION_SECRET_TOKEN) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

export { SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN };
