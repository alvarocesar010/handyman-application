import { NextResponse } from "next/server";
import { signAdminJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    // Wrong user/pass → back to login with ?error=1
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

    // IMPORTANT: use an absolute URL based on the request
    const redirectUrl = new URL("/admin/bookings", req.url);
    const res = NextResponse.redirect(redirectUrl);

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });

    return res;
  } catch (err) {
    console.error("LOGIN API ERROR", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
