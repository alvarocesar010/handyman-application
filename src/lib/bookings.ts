import type { ObjectId } from "mongodb";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id?: ObjectId; // ✅ IMPORTANT
  serviceDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  status: BookingStatus;
}
