import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
const alg = "HS256";

async function isAuthenticated(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminPath) return NextResponse.next();

  // ✅ Allow bot / server with secret
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${process.env.ADMIN_API_SECRET}`) {
    return NextResponse.next();
  }

  // allow login routes
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/login")
  ) {
    return NextResponse.next();
  }

  // ✅ Cookie auth
  if (await isAuthenticated(req)) {
    return NextResponse.next();
  }

  // ✅ API should return JSON, not redirect
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ UI redirect
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";

  return NextResponse.redirect(loginUrl);
}
