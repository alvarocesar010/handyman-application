import { getDb } from "@/lib/mongodb";
import ContactCard from "./ContactCard";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  service?: string;
  message: string;
  createdAt: Date;
};

export default async function ContactsPage() {
  const db = await getDb();

  const contactsRaw = await db
    .collection<Contact>("contacts") // ✅ THIS LINE FIXES EVERYTHING
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const contacts = contactsRaw.map((c) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Contacts ({contacts.length})</h1>

      <div className="grid gap-4">
        {contacts.map((c) => (
          <ContactCard key={c._id.toString()} contact={c} />
        ))}
      </div>
    </main>
  );
}
