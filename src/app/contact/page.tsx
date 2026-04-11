import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";
import ContactClient from "./ContactClient";
import { getContactMetadata } from "./seo";
import type { Metadata } from "next";

// ✅ This connects SEO with the page
export async function generateMetadata(): Promise<Metadata> {
  return getContactMetadata();
}

export default async function ContactPage() {
  const locale = await getLocale();
  const m = getMessages(locale).contact;

  return <ContactClient m={m} />;
}
