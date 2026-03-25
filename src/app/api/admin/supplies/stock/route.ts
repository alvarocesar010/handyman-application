import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body: {
      updates: {
        supplyId: string;
        inventoryId: string; // ✅ CHANGE HERE
        qtyToDecrease: number;
      }[];
    } = await req.json();
    const db = await getDb();

    for (const item of body.updates) {
      const { supplyId, inventoryId, qtyToDecrease } = item;

       await db.collection("supplies").updateOne(
        {
          _id: new ObjectId(supplyId),
        },
        {
          $inc: {
            "storeEntries.$[].inventory.$[inv].qty": -qtyToDecrease,
          },
        },
        {
          arrayFilters: [{ "inv._id": inventoryId }],
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Stock update failed" },
      { status: 500 },
    );
  }
}
