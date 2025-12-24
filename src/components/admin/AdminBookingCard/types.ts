export type AdminPhoto = { id: string; filename: string };

export type AdminBooking = {
  _id: string;
  service: string;
  date: string; // YYYY-MM-DD
  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  description: string;
  createdAt: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  photos?: AdminPhoto[];

  budget?: number;
  adminNotes?: string;
  startTime?: string;
  durationMinutes?: number;
  serviceDate?: string; // YYYY-MM-DD (real date)

  amountReceived?: number;
  tipReceived?: number;
  finishTime?: string;
  actualDurationMinutes?: number;
};
