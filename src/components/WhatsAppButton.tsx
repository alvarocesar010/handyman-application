// src/components/TrackedCallButton.tsx
"use client";

import { handleConversionClick } from "@/lib/ads";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({
  phone,
  className,
  content,
}: {
  phone: string;
  className?: string;
  content?: string;
}) {
  const href = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => handleConversionClick(e, href)}
    >
      <MessageCircle />
      {content}
    </a>
  );
}
