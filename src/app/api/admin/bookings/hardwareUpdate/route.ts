import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const db = await getDb();

    const body: {
      id: string;
      supplies: {
        _id: string;
        inventoryId: string;
        qty: number;
      }[];
    } = await req.json();

    const { id, supplies } = body;

    // ✅ 1. Update booking
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          supplies,
          updatedAt: new Date(),
        },
      },
    );

    // ✅ 2. Update stock
    for (const item of supplies) {
      const result = await db.collection("supplies").updateOne(
        {
          _id: new ObjectId(item._id),
        },
        {
          $inc: {
            "storeEntries.$[].inventory.$[inv].qty": -item.qty,
          },
        },
        {
          arrayFilters: [{ "inv._id": item.inventoryId }],
        },
      );

     

      // ❌ If something is wrong → stop
      if (result.matchedCount === 0) {
        throw new Error("Stock item not found");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking and stock updated",
    });
  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
