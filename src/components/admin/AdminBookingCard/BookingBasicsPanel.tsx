import { AdminBooking } from "./types";
import { minutesToHM } from "./utils";

export default function BookingBasicsPanel({
  booking,
}: {
  booking: AdminBooking;
}) {
  const hasBasics =
    booking.budget != null ||
    booking.startTime ||
    booking.durationMinutes != null;

  if (!hasBasics) return null;

// ✅ Super safe finish time calculation
  let calculatedFinishTime = "—";
  
  const startTime = booking.startTime;
  const duration = Number(booking.durationMinutes);

  if (startTime && !isNaN(duration) && duration > 0) {
    const [hours, minutes] = startTime.split(":").map(Number);
    
    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes + duration;
      const finalHours = Math.floor(totalMinutes / 60) % 24;
      const finalMinutes = totalMinutes % 60;
      
      calculatedFinishTime = `${String(finalHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
    }
  } else if (startTime) {
    // If we have a start time but no valid duration yet, just show the start time
    calculatedFinishTime = startTime;
  }

  return (
    <div className=" rounded-lg border bg-slate-50 p-3 ">
      <h3>Planned:</h3>
      <div className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-3">
        <div className="w-full align-middle flex flex-col justify-center">
          <div className="text-slate-500 text-center">Budget</div>
          <div className="font-medium text-slate-900 text-center">
            {typeof booking.budget === "number" ? `€${booking.budget}` : "—"}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="w-full align-middle flex flex-col justify-center">
            <div className="text-slate-500 text-center ">Start</div>
            <div className="font-medium text-slate-900 text-center">
              {booking.startTime || "—"}
            </div>
          </div>
          <div className="w-full align-middle flex flex-col justify-center">
            <div className="text-slate-500 text-center">Finish</div>
            <div className="font-medium text-slate-900 text-center">
              {/* ✅ Replace the duplicated startTime with our new calculation */}
              {calculatedFinishTime}
            </div>
          </div>
        </div>

        <div className="w-full align-middle flex flex-col justify-center">
          <div className="text-slate-500 text-center">Duration</div>
          <div className="font-medium text-slate-900 text-center">
            {typeof booking.durationMinutes === "number"
              ? `${booking.durationMinutes} min (${minutesToHM(
                  booking.durationMinutes,
                )})`
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}