import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  const res = new NextResponse("Auth required", { status: 401 });
  res.headers.set("WWW-Authenticate", 'Basic realm="Admin Area"');
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin pages and admin APIs
  const isAdminPath =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminPath) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  const base64 = header.split(" ")[1] ?? "";
  const [user, pass] = Buffer.from(base64, "base64").toString().split(":");

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return NextResponse.next();
  }
  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
