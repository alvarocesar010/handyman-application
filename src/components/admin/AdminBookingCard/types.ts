export type AdminPhoto = { id: string; filename: string };

export type AdminBookingStatus = "pending" | "confirmed" | "done" | "cancelled";

export type AdminBooking = {
  _id: string;

  service: string;

  // preferred date (customer picked)
  date: string; // YYYY-MM-DD

  // real service date (you did / will do the job)
  serviceDate?: string; // YYYY-MM-DD

  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  description: string;

  createdAt: string;
  status: AdminBookingStatus;

  photos?: AdminPhoto[];

  // planning
  budget?: number;
  startTime?: string; // HH:mm
  durationMinutes?: number; // estimated minutes
  adminNotes?: string;

  // done / financial
  amountReceived?: number;
  tipReceived?: number;
  finishTime?: string; // HH:mm
  actualDurationMinutes?: number; // calculated minutes (start->finish)
};

// -------------------------
// Filters used in Bookings page (same style as Dashboard)
// -------------------------
export type Bucket = "day" | "week" | "month";
export type Preset = "today" | "week" | "month" | "all" | "custom";

export type RangeInfo = {
  preset: Preset;
  bucket: Bucket;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
};

// Optional: if you want strongly typed counts for tabs
export type StatusCounts = Record<AdminBookingStatus, number>;
