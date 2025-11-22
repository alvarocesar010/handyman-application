import { NextResponse } from "next/server";
import { signAdminJwt } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  // wrong user/pass -> back to /admin/login with ?error=1
  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url);
  }

  const token = await signAdminJwt({
    sub: "admin",
    username,
    role: "admin",
  });

  // use the same origin as the current request
  const { origin } = new URL(req.url);
  const res = NextResponse.redirect(`${origin}/admin/bookings`);

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });

  return res;
}
