// src/app/api/booking/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
// import twilio from "twilio";

/* ---------- Next.js route hints ---------- */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------- Helpers ---------- */

// function toE164Irish(input: string): string | null {
//   if (!input) return null;
//   const p = input.trim().replace(/[^\d+]/g, "");
//   if (p.startsWith("+") && /^\+\d{7,15}$/.test(p)) return p;
//   if (/^0\d{7,10}$/.test(p)) return `+353${p.slice(1)}`;
//   if (/^8\d{7,9}$/.test(p)) return `+353${p}`;
//   return null;
// }

// function labelFromSlug(slug: string) {
//   return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// }

// const SID = process.env.TWILIO_ACCOUNT_SID || "";
// const TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
// const SMS_FROM = process.env.TWILIO_SMS_FROM || "";
// const WA_FROM = process.env.TWILIO_WA_FROM || "";

// const twilioClient = SID && TOKEN ? twilio(SID, TOKEN) : null;

// async function sendNotifications(...) {}

/* ---------- Types ---------- */

type DistanceResponse = {
  cost: number;
  distance: string;
  duration: number;
};

/* ---------- POST handler ---------- */

export async function POST(req: Request) {
  try {
    const form = await req.formData();

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
        { status: 400 },
      );
    }

    // TEMP: no validation (kept as requested)
    const phoneE164 = phoneRaw;

    // const phoneE164 = toE164Irish(phoneRaw);
    // if (!phoneE164) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Please enter a valid Irish phone number (e.g., +353 87 123 4567).",
    //     },
    //     { status: 400 },
    //   );
    // }

    let distanceCost: number | null = null;
    let distanceKm: string | null = null;
    let distanceDuration: number | null = null;

    try {
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";

      const distanceRes = await fetch(`${baseUrl}/api/distance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eircode }),
      });

      if (distanceRes.ok) {
        const distanceData: DistanceResponse = await distanceRes.json();

        distanceCost = distanceData.cost;
        distanceKm = distanceData.distance;
        distanceDuration = distanceData.duration;
      }
    } catch {
      // Do not block booking creation
    }

    const files = form.getAll("photos").filter(Boolean) as File[];
    const db = await getDb();

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
      status: "new" | "pending" | "confirmed" | "done" | "cancelled";
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
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    if (files.length > 0) {
      const bucket = new GridFSBucket(db, {
        bucketName: "booking-uploads",
      });

      for (const f of files) {
        if (f.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `Image "${f.name}" is larger than 5MB.` },
            { status: 400 },
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

    const result = await db.collection("bookings").insertOne(bookingDoc);

    // sendNotifications({
    //   name,
    //   phoneE164,
    //   service,
    //   date,
    //   eircode,
    // }).catch((e) => console.error("notify error:", e));

    return NextResponse.json({
      ok: true,
      id: result.insertedId,
    });
  } catch (err: unknown) {
    console.error("Booking POST error:", err);

    return NextResponse.json(
      { error: "Internal error while creating the booking." },
      { status: 500 },
    );
  }
}
