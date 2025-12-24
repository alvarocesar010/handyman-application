"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type DashboardResponse = {
  range: { from: string; to: string; bucket: "day" | "week" | "month" };
  kpis: {
    totalRevenue: number;
    totalTips: number;
    totalServices: number;
    uniqueCustomers: number;
    avgTicket: number;
    avgTip?: number;
  };
  charts: {
    revenueByDate: { date: string; revenue: number }[];
    servicesByDate: { date: string; services: number }[];
    customersByDate: { date: string; customers: number }[];
    servicesByType: { service: string; count: number; revenue: number }[];
    funnel: { status: string; count: number }[];
    budgetVsRevenueByDate: { date: string; budget: number; revenue: number }[];
  };
};

function toISODateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatMoney(v: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(v || 0);
}

function formatDateLabel(dateStr: string): string {
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [y, m] = dateStr.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString("en-IE", { month: "short", year: "numeric" });
  }
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IE");
}

const PIE_COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

export default function AdminDashboardClient() {
  const [preset, setPreset] = useState<"today" | "week" | "month" | "custom">(
    "month"
  );
  const [bucket, setBucket] = useState<"day" | "week" | "month">("day");
  const [from, setFrom] = useState(
    toISODateOnly(new Date(Date.now() - 30 * 86400000))
  );
  const [to, setTo] = useState(toISODateOnly(new Date()));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const now = new Date();
    let f = new Date(now);
    let t = new Date(now);

    if (preset === "today") {
      f = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      setBucket("day");
    }

    if (preset === "week") {
      const day = now.getDay(); // 0..6 (Sun..Sat)
      const diff = day === 0 ? 6 : day - 1;
      f = new Date(now);
      f.setDate(now.getDate() - diff);
      t = new Date(now);
      setBucket("day");
    }

    if (preset === "month") {
      f = new Date(now.getFullYear(), now.getMonth(), 1);
      t = new Date(now);
      setBucket("day");
    }

    if (preset !== "custom") {
      setFrom(toISODateOnly(f));
      setTo(toISODateOnly(t));
    }
  }, [preset]);

  async function fetchDashboard(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ from, to, bucket }).toString();
      const res = await fetch(`/api/admin/dashboard?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = (await res.json()) as DashboardResponse;
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, bucket]);

  const kpis = data?.kpis;

  const revenueSeries = useMemo(() => {
    const list = data?.charts.revenueByDate || [];
    return list.map((x) => ({ ...x, dateLabel: formatDateLabel(x.date) }));
  }, [data]);

  const servicesSeries = useMemo(() => {
    const list = data?.charts.servicesByDate || [];
    return list.map((x) => ({ ...x, dateLabel: formatDateLabel(x.date) }));
  }, [data]);

  const customersSeries = useMemo(() => {
    const list = data?.charts.customersByDate || [];
    return list.map((x) => ({ ...x, dateLabel: formatDateLabel(x.date) }));
  }, [data]);

  const budgetVsRevenueSeries = useMemo(() => {
    const list = data?.charts.budgetVsRevenueByDate || [];
    return list.map((x) => ({ ...x, dateLabel: formatDateLabel(x.date) }));
  }, [data]);

  const funnel = data?.charts.funnel || [];
  const funnelCount = (status: string) =>
    funnel.find((x) => x.status === status)?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-md border px-3 py-1.5 text-sm"
          value={preset}
          onChange={(e) => setPreset(e.target.value as typeof preset)}
        >
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>

        {preset === "custom" && (
          <>
            <input
              className="rounded-md border px-3 py-1.5 text-sm"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-1.5 text-sm"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </>
        )}

        <select
          className="rounded-md border px-3 py-1.5 text-sm"
          value={bucket}
          onChange={(e) => setBucket(e.target.value as typeof bucket)}
        >
          <option value="day">Group by day</option>
          <option value="week">Group by week</option>
          <option value="month">Group by month</option>
        </select>

        <button
          onClick={fetchDashboard}
          className="rounded-md border px-3 py-1.5 text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard
          label="Total revenue (done)"
          value={formatMoney(kpis?.totalRevenue ?? 0)}
        />
        <KpiCard
          label="Total tips (done)"
          value={formatMoney(kpis?.totalTips ?? 0)}
        />
        <KpiCard
          label="Services done"
          value={String(kpis?.totalServices ?? 0)}
        />
        <KpiCard label="Customers" value={String(kpis?.uniqueCustomers ?? 0)} />
        <KpiCard
          label="Average ticket"
          value={formatMoney(kpis?.avgTicket ?? 0)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Revenue over time">
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip
                  formatter={(v?: number | string) => formatMoney(Number(v))}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Services over time">
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <BarChart data={servicesSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="services" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Customers over time">
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <LineChart data={customersSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="customers"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Services by type (done)">
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data?.charts.servicesByType || []}
                  dataKey="count"
                  nameKey="service"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {(data?.charts.servicesByType || []).map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ✅ FIXED: Budget vs Revenue (2 lines + legend) */}
      <Panel title="Budget vs Revenue (done)">
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <LineChart data={budgetVsRevenueSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateLabel" />
              <YAxis />
              <Tooltip
                formatter={(v?: number | string) => formatMoney(Number(v))}
              />
              <Legend />

              <Line
                type="monotone"
                dataKey="budget"
                name="Budget"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Funnel (created in range)">
        <div className="grid gap-3 md:grid-cols-4">
          <FunnelBox status="pending" count={funnelCount("pending")} />
          <FunnelBox status="confirmed" count={funnelCount("confirmed")} />
          <FunnelBox status="done" count={funnelCount("done")} />
          <FunnelBox status="cancelled" count={funnelCount("cancelled")} />
        </div>
      </Panel>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 font-semibold text-slate-900">{title}</div>
      {children}
    </div>
  );
}

function FunnelBox({ status, count }: { status: string; count: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm capitalize text-slate-500">{status}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{count}</div>
    </div>
  );
}
