import AdminNav from "@/components/NavBar/AdminNav";
import { Shuffle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const switchSite = async (): Promise<string> => {
    const headersList = await headers();
    const host = headersList.get("host") || "";

    const isDev = process.env.NODE_ENV === "development";
    const isLislock = host.includes("lislock");

    if (isDev) {
      return isLislock
        ? "http://dublinerhandyman.local:3000/admin/bookings"
        : "http://lislock.local:3000/admin/bookings";
    }

    return isLislock
      ? "https://dublinerhandyman.pt/admin/bookings"
      : "https://lislock.pt/admin/bookings";
  };

  const url = await switchSite();

  return (
    <main className="mx-auto max-w-6xl px-3 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <Link
          className="p-2 bg-white rounded-lg shadow text-sm font-bold items-center flex flex-row gap-2"
          href={url}
        >
          <Shuffle size={14} />
          Swtich Domain
        </Link>
        <AdminNav />
      </header>
      {children}
    </main>
  );
}
