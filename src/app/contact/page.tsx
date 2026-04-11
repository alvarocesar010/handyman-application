import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";
import ContactClient from "./ContactClient";

export default async function ContactPage() {
  const locale = await getLocale();
  const m = getMessages(locale).contact;

  return <ContactClient m={m} />;
}
