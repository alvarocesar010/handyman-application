// src/app/api/booking/photo/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { GridFSBucket, ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  const { id } = await ctx.params; // 👈 await it

  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return new NextResponse("Bad id", { status: 400 });
  }

  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: "booking-uploads" });

  const files = await bucket.find({ _id }).toArray();
  if (files.length === 0) return new NextResponse("Not found", { status: 404 });

  const file = files[0];
  const stream = bucket.openDownloadStream(_id);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
