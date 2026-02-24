// src/app/contact/page.tsx
import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getContactMetadata } from "./seo";

export async function generateMetadata(): Promise<Metadata> {
  return getContactMetadata();
}

export default function ContactPage() {
  return <ContactClient />;
}
