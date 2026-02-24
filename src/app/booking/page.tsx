import { Suspense } from "react";
import BookingClient from "./BookingClient";
import { getServices } from "@/lib/getServices";
import { getSeo } from "@/lib/getSeo";

export const generateMetadata = () => getSeo("booking");

export default async function BookingPage() {
  const services = await getServices();
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading booking form...</div>}
    >
      <BookingClient services={services} />
    </Suspense>
  );
}
