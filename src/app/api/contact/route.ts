import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  // Honeypot – if filled, treat as spam
  const honey = form.get("company");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const phone = String(form.get("phone") ?? "");
  const date = String(form.get("date") ?? "");
  const service = String(form.get("service") ?? "");
  const message = String(form.get("message") ?? "");

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("CONTACT", { name, email, phone, date, service, message });
  }

  return NextResponse.json({ ok: true });
}
