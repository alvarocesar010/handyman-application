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

  const contacts = await db
    .collection<Contact>("contacts") // ✅ THIS LINE FIXES EVERYTHING
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

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
