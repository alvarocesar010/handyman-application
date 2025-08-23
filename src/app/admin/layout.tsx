import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <nav className="text-sm text-slate-600 space-x-4">
          <Link className="hover:underline" href="/admin/bookings">
            Bookings
          </Link>
          <Link className="hover:underline" href="/">
            ← Site
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
