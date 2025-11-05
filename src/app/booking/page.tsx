import { Suspense } from "react";
import BookingClient from "./BookingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Repair | Dubliner Handyman",
  description:
    "Book a professional handyman service in Dublin — fast response, expert repairs.",
  alternates: {
    canonical: "https://dublinerhandyman.ie/booking",
  },
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading booking form...</div>}
    >
      <BookingClient />
    </Suspense>
  );
}
