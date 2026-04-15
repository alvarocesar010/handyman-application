"use client";

import { reportConversionAwait } from "@/lib/ads";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppButton({
  href,
  className,
  content,
}: {
  href: string;
  className?: string;
  content?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={async () =>
        await reportConversionAwait({ value: 1.0, currency: "EUR" }, 2000)
      }
    >
      <MessageCircle />
      {content}
    </Link>
  );
}
