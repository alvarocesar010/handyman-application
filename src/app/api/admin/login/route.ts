import { NextResponse } from "next/server";
import { signAdminJwt } from "@/lib/auth";
import { getLocale } from "@/lib/getLocale";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    // [Authentication logic remains the same]
    if (
      username !== process.env.ADMIN_USER ||
      password !== process.env.ADMIN_PASS
    ) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("error", "1");
      return NextResponse.redirect(url);
    }
    // [JWT signing logic remains the same]
    const token = await signAdminJwt({
      sub: "admin",
      username,
      role: "admin",
    });

    // --- 🎯 MODIFIED CODE HERE ---
    const locale = await getLocale();

    const isDev = process.env.NODE_ENV === "development";

    const port = process.env.PORT || 3000;

    let siteUrl;

    if (locale === "pt") {
      siteUrl = isDev ? `http://lislock.local:${port}` : "https://lislock.pt";
    } else {
      siteUrl = isDev
        ? `http://dublinerhandyman.local:${port}`
        : "https://dublinerhandyman.ie";
    }

    // Use the determined base URL to construct the redirect URL
    const redirectUrl = new URL("/admin/bookings", await siteUrl);
    // -----------------------------

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
