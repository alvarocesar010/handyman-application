"use client";

import { ReactNode } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { cx } from "@/utils/cx";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: Props<T>) {
  return (
    <ToggleButtonGroup
      selectedKeys={[value]}
      selectionMode="single"
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as T;
        if (selected) onChange(selected);
      }}
      className={cx(
        "inline-flex rounded-lg shadow-sm overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar",
        className,
      )}
    >
      {options.map((opt) => (
        <ToggleButton
          key={opt.value}
          id={opt.value}
          className={cx(
            "flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 bg-white transition-all",
            "hover:bg-slate-100",

            // ✅ Selected state
            "data-[selected]:bg-slate-900 data-[selected]:text-white data-[selected]:scale-105",

            // Smooth animation
            "transition-transform duration-150",
          )}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
