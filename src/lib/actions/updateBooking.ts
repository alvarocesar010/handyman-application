import { toast } from "react-toastify";

type UpdateBookingParams = {
  id: string;
  updates: Record<string, unknown>;
  setLoading?: (v: boolean) => void;
};

export async function updateBookingAction({
  id,
  updates,
  setLoading,
}: UpdateBookingParams) {
  try {
    setLoading?.(true);

    const res = await fetch("/api/admin/bookings/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, updates }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update");
    }

    toast.success("Saved successfully");

    return data;
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong");
    }
    throw err;
  } finally {
    setLoading?.(false);
  }
}