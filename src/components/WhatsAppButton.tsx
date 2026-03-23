"use client";

import { handleConversionClick } from "@/lib/ads";
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
      onClick={(e) => handleConversionClick(e, href)}
    >
      <MessageCircle />
      {content}
    </Link>
  );
}
