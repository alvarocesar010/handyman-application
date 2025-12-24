import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
      <AdminDashboardClient />
    </div>
  );
}
