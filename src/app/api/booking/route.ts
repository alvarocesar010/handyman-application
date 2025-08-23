import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();

  const service = String(form.get("service") ?? "");
  const date = String(form.get("date") ?? "");
  const name = String(form.get("name") ?? "");
  const phone = String(form.get("phone") ?? "");
  const address = String(form.get("address") ?? "");
  const eircode = String(form.get("eircode") ?? "");
  const description = String(form.get("description") ?? "");

  if (
    !service ||
    !date ||
    !name ||
    !phone ||
    !address ||
    !eircode ||
    !description
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await getDb();

  // 1) Create a placeholder booking (so we can link GridFS files to this _id)
  const now = new Date();
  const bookingDoc = {
    service,
    date,
    name,
    phone,
    address,
    eircode,
    description,
    photos: [] as {
      fileId: ObjectId;
      filename: string;
      size: number;
      contentType: string;
    }[],
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
  };

  // 2) Save photos to GridFS (bucket: "booking-uploads")
  const bucket = new GridFSBucket(db, { bucketName: "booking-uploads" });
  const files = form.getAll("photos").filter(Boolean) as File[];

  for (const f of files) {
    // optional server-side size guard (<= 5 MB)
    if (f.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Image ${f.name} is larger than 5MB` },
        { status: 400 }
      );
    }

    const arrayBuffer = await f.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const uploadStream = bucket.openUploadStream(f.name, {
      contentType: f.type || "application/octet-stream",
      metadata: { bookingHint: name, service },
    });

    // pipe + await finish
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(uploadStream)
        .on("finish", () => resolve())
        .on("error", reject);
    });

    bookingDoc.photos.push({
      fileId: uploadStream.id as ObjectId,
      filename: f.name,
      size: buffer.length,
      contentType: f.type || "application/octet-stream",
    });
  }

  // 3) Insert the booking with references to GridFS files
  const result = await db.collection("bookings").insertOne(bookingDoc);

  return NextResponse.json({ ok: true, id: result.insertedId });
}
