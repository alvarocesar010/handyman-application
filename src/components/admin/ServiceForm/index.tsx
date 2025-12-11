"use client";

import { useState } from "react";
import DistancePage from "../Distance";

export default function ServiceForm() {
  const [eircode, setEircode] = useState<string>("");
  return (
    <form action="" className="flex col-auto">
      <div className="grid gap-2">
        <input
          type="date"
          name="preferredName"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className="frounded-md border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          name="eircode"
          placeholder="EIRCODE"
          value={eircode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEircode(e.target.value)
          }
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <textarea
          name="description"
          rows={4}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      <DistancePage eircode={eircode} />
      </div>
    </form>
  );
}
