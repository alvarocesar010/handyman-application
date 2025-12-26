import AdminBookingCard from "@/components/admin/AdminBookingCard";
import type { AdminBooking } from "@/components/admin/AdminBookingCard/types";

export default function AdminBookingsSection({
  title,
  items,
}: {
  title: string;
  items: AdminBooking[];
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {title} <span className="text-slate-500">({items.length})</span>
        </h3>
      </div>

      <div className="w-full ">
        <div className="h-[85vh] overflow-y-auto p-0.5 md:p-4">
          <div className="grid gap-4">
            {items.map((b) => (
              <AdminBookingCard key={b._id} booking={b} />
            ))}

            {items.length === 0 && (
              <p className="text-sm text-slate-500">No items.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
