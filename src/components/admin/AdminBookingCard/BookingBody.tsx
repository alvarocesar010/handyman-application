"use client";

import { useState } from "react";
import type { AdminBooking } from "./types";
import BookingDonePanel from "./BookingDonePanel";
import BookingPhotos from "./BookingPhotos";
import BookingActions from "./BookingActions";
import BookingDetailsEditor from "./BookingDetailsEditor";
import HardwareList from "./BookingBody/HardwareList";
import ServiceDescription from "./ServiceDescription";
import { ButtonGroup } from "@/components/Buttons/ButtonGroup";

export default function BookingBody({ booking }: { booking: AdminBooking }) {
  const [editing, setEditing] = useState(false);

  // ButtonGroup Settings
  const [value, setValue] = useState("ServiceDescription");
  const options = [
    { value: "ServiceDescription", label: "Description" },
    { value: "HardwareList", label: "Hardware" },
    { value: "Photos", label: "Photos" },
    { value: "Timetable", label: "Timetable" },
  ];

  return (
    <div className="px-2 gap-3 flex flex-col pb-4 pt-2 border-t border-slate-100">
      {/* ButtonGroup for selection of feature */}
      <ButtonGroup options={options} value={value} onChange={setValue} />

      {/* Service Description */}
      {value === "ServiceDescription" && (
        <ServiceDescription
          description={booking.adminNotes}
          bookingId={booking._id}
        />
      )}

      {/* --------------------------------------------------------- */}

      {/* Hardware List */}
      {value === "HardwareList" && (
        <HardwareList
          bookingId={booking._id}
          initialSupplies={booking.supplies}
        />
      )}

      {/* Photos list */}
      {value === "Photos" && <BookingPhotos photos={booking.photos} />}

      {/* Timetable */}
      {value === "Timetable" && <BookingDonePanel booking={booking} />}
      {/* --------------------------------------------------------- */}

      {editing && (
        <BookingDetailsEditor
          booking={booking}
          onClose={() => setEditing(false)}
        />
      )}

      <BookingActions
        bookingId={booking._id}
        onToggleEditing={() => setEditing((v) => !v)}
      />
    </div>
  );
}
