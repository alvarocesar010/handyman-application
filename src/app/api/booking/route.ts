// src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import twilio from "twilio";

/* ---------- Next.js route hints ---------- */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------- Helpers ---------- */

// Very small Irish/E.164 normaliser. Returns +353… or null if invalid.
function toE164Irish(input: string): string | null {
  if (!input) return null;
  const p = input.trim().replace(/[^\d+]/g, ""); // keep digits and leading +
  if (p.startsWith("+") && /^\+\d{7,15}$/.test(p)) return p; // already E.164
  if (/^0\d{7,10}$/.test(p)) return `+353${p.slice(1)}`; // 0XXXXXXXX → +353XXXXXXXX
  if (/^8\d{7,9}$/.test(p)) return `+353${p}`; // 8XXXXXXXX → +3538XXXXXXXX
  return null;
}

function labelFromSlug(slug: string) {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* Twilio init (server only) */
const SID = process.env.TWILIO_ACCOUNT_SID || "";
const TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const SMS_FROM = process.env.TWILIO_SMS_FROM || ""; // e.g. +1774… (trial) or a paid number
const WA_FROM = process.env.TWILIO_WA_FROM || ""; // e.g. whatsapp:+14155238886 (sandbox) or whatsapp:+3538…

const twilioClient = SID && TOKEN ? twilio(SID, TOKEN) : null;

async function sendNotifications(opts: {
  name: string;
  phoneE164: string;
  service: string;
  date: string;
  eircode: string;
}) {
  if (!twilioClient) return; // not configured; silently skip

  const first = opts.name.split(" ")[0] || "there";
  const serviceLabel = labelFromSlug(opts.service);

  const smsBody =
    `Hi ${first}, we received your booking for ${serviceLabel} on ${opts.date}. ` +
    `We’ll confirm shortly. — Dublin Handyman`;

  const waBody =
    `✅ *Booking received*\n\n` +
    `*Name:* ${opts.name}\n` +
    `*Service:* ${serviceLabel}\n` +
    `*Date:* ${opts.date}\n` +
    `*Eircode:* ${opts.eircode}\n\n` +
    `We’ll confirm availability shortly.\n_Dublin Handyman_`;

  const tasks: Promise<unknown>[] = [];

  if (SMS_FROM) {
    tasks.push(
      twilioClient.messages
        .create({ from: SMS_FROM, to: opts.phoneE164, body: smsBody })
        .catch((e) => console.error("SMS error:", e?.message || e))
    );
  }

  if (WA_FROM) {
    tasks.push(
      twilioClient.messages
        .create({
          from: WA_FROM,
          to: `whatsapp:${opts.phoneE164}`,
          body: waBody,
        })
        .catch((e) => console.error("WA error:", e?.message || e))
    );
  }

  await Promise.allSettled(tasks); // don’t block on failures
}

/* ---------- POST handler ---------- */
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Required fields
    const service = String(form.get("service") ?? "");
    const date = String(form.get("date") ?? "");
    const time = String(form.get("time") ?? "");
    const name = String(form.get("name") ?? "");
    const phoneRaw = String(form.get("phone") ?? "");
    const address = String(form.get("address") ?? "");
    const eircode = String(form.get("eircode") ?? "");
    const description = String(form.get("description") ?? "");

    if (
      !service ||
      !date ||
      !time ||
      !name ||
      !phoneRaw ||
      !address ||
      !eircode ||
      !description
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const phoneE164 = toE164Irish(phoneRaw);
    if (!phoneE164) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid Irish phone number (e.g., +353 87 123 4567).",
        },
        { status: 400 }
      );
    }
    let distanceCost: number | null = null;
    let distanceKm: string | null = null;
    let distanceDuration: number | null = null;

    try {
      console.log(eircode);
      const distanceRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL ?? "https://dublinerhandyman.ie"
        }/api/distance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eircode }),
        }
      );

      if (distanceRes.ok) {
        const distanceData = await distanceRes.json();

        distanceCost = distanceData.cost;
        distanceKm = distanceData.distance;
        distanceDuration = distanceData.duration;
      }
    } catch {
      // booking must NOT fail because of distance
    }

    // Files (optional)
    const files = form.getAll("photos").filter(Boolean) as File[];
    const db = await getDb();

    // Prepare booking doc
    const now = new Date();
    const bookingDoc: {
      _id?: ObjectId;
      service: string;
      date: string;
      time: string;
      name: string;
      phoneRaw: string;
      phoneE164: string;
      address: string;
      eircode: string;
      distanceKm?: string | null;
      distanceDuration?: number | null;
      distanceCost?: number | null;
      description: string;
      photos: {
        fileId: ObjectId;
        filename: string;
        size: number;
        contentType: string;
      }[];
      status: "pending" | "confirmed" | "done" | "cancelled";
      createdAt: Date;
      updatedAt: Date;
    } = {
      service,
      date,
      time,
      name,
      phoneRaw,
      phoneE164,
      address,
      eircode,
      distanceKm,
      distanceDuration,
      distanceCost,
      description,
      photos: [],
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    // Upload images to GridFS
    if (files.length > 0) {
      const bucket = new GridFSBucket(db, { bucketName: "booking-uploads" });

      for (const f of files) {
        // Server-side constraints
        if (f.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `Image "${f.name}" is larger than 5MB.` },
            { status: 400 }
          );
        }

        const buf = Buffer.from(await f.arrayBuffer());
        const stream = Readable.from(buf);

        const uploadStream = bucket.openUploadStream(f.name, {
          contentType: f.type || "application/octet-stream",
          metadata: { bookingName: name, service },
        });

        await new Promise<void>((resolve, reject) => {
          stream
            .pipe(uploadStream)
            .on("finish", () => resolve())
            .on("error", reject);
        });

        bookingDoc.photos.push({
          fileId: uploadStream.id as ObjectId,
          filename: f.name,
          size: buf.length,
          contentType: f.type || "application/octet-stream",
        });
      }
    }

    // Save booking
    const result = await db.collection("bookings").insertOne(bookingDoc);

    // Fire-and-forget notifications (don’t block response)
    sendNotifications({
      name,
      phoneE164,
      service,
      date,
      eircode,
    }).catch((e) => console.error("notify error:", e?.message || e));

    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (err: unknown) {
    console.error("Booking POST error:", err);
    return NextResponse.json(
      { error: "Internal error while creating the booking." },
      { status: 500 }
    );
  }
}
