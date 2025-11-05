// src/components/TrackedCallButton.tsx
"use client";

import { handleConversionClick } from "@/lib/ads";

export default function TrackedCallButton({
  phone,
  className,
  children = "Call Now",
}: {
  phone: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const href = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => handleConversionClick(e, href)}
    >
      {children}
    </a>
  );
}
