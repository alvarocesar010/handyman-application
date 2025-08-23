import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  const db = await getDb();
  await db.collection("bookings").createIndex({ createdAt: -1 });
  return NextResponse.redirect(new URL("/admin/bookings", req.url));
}
