"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  size?: "sm" | "md" | "lg" | "full";
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  size = "md",
}: Props) {
  const sizes = {
    sm: {
      container: "h-8",
      button: "h-full px-2",
      text: "text-xs w-6",
    },
    md: {
      container: "h-10",
      button: "h-full px-3",
      text: "text-sm w-10",
    },
    lg: {
      container: "h-12",
      button: "h-full px-4",
      text: "text-base w-12",
    },
    full: {
      container: "h-full",
      button: "h-full px-3",
      text: "w-18",
    },
  };

  const s = sizes[size];

  return (
    <div
      className={`flex items-stretch border rounded-lg overflow-hidden ${s.container}`}
    >
      <button
        onClick={() => onChange(value > min ? value - 1 : value)}
        className={`${s.button} flex items-center justify-center text-gray-500 hover:text-black`}
      >
        <Minus size={18} />
      </button>

      <span
        className={`${s.text} flex items-center justify-center font-semibold`}
      >
        {value}
      </span>

      <button
        onClick={() => onChange(value + 1)}
        className={`${s.button} flex items-center justify-center text-gray-500 hover:text-black`}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
