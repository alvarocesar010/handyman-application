import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: {
      id?: string;
      updates?: Record<string, unknown>;
    } = await req.json();

    const { id, updates } = body;

    // ✅ Basic validation
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid id" },
        { status: 400 },
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid updates" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (err) {
    console.error("PATCH /bookings/update error:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
