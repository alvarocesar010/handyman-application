// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/**
 * Query:
 * - from=YYYY-MM-DD
 * - to=YYYY-MM-DD
 * - bucket=day|week|month
 *
 * Notes:
 * - "done" bookings count as completed work
 * - revenue is summed from `budget` (0 if missing)
 * - time grouping is done using MongoDB $dateTrunc
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const bucket = (searchParams.get("bucket") || "day") as
      | "day"
      | "week"
      | "month";

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(now.getDate() - 30);

    const from = fromStr ? new Date(fromStr) : defaultFrom;
    const to = toStr ? new Date(toStr) : now;

    // normalize end of day for "to"
    to.setHours(23, 59, 59, 999);

    const db = await getDb();

    // Prefer:
    // - if booking has "date" string => parse it
    // - else fallback to createdAt
    // We build "serviceDate" inside pipeline.
    //
    // If your `date` is always "YYYY-MM-DD", $dateFromString will work.
    const bucketUnit = bucket;

    const baseMatchCreatedRange = {
      createdAt: { $gte: from, $lte: to },
    };

    // "done" inside range by serviceDate (preferred) otherwise createdAt
    const doneMatchByServiceDateExpr = {
      status: "done",
      $expr: {
        $and: [
          { $gte: ["$serviceDate", from] },
          { $lte: ["$serviceDate", to] },
        ],
      },
    };

    const pipelineAddServiceDate = [
      {
        $addFields: {
          serviceDate: {
            $ifNull: [
              {
                $cond: [
                  { $and: [{ $ne: ["$date", null] }, { $ne: ["$date", ""] }] },
                  {
                    $dateFromString: {
                      dateString: "$date",
                      timezone: "UTC",
                      onError: "$createdAt",
                      onNull: "$createdAt",
                    },
                  },
                  "$createdAt",
                ],
              },
              "$createdAt",
            ],
          },
          revenueValue: { $ifNull: ["$budget", 0] },
        },
      },
    ];

    const [
      kpisAgg,
      revenueByDate,
      servicesByDate,
      customersByDate,
      servicesByType,
      funnelAgg,
    ] = await Promise.all([
      // KPIs (done only)
      db
        .collection("bookings")
        .aggregate([
          ...pipelineAddServiceDate,
          { $match: doneMatchByServiceDateExpr },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$revenueValue" },
              totalServices: { $sum: 1 },
              uniqueCustomers: { $addToSet: "$phoneRaw" },
            },
          },
          {
            $project: {
              _id: 0,
              totalRevenue: 1,
              totalServices: 1,
              uniqueCustomers: { $size: "$uniqueCustomers" },
              avgTicket: {
                $cond: [
                  { $gt: ["$totalServices", 0] },
                  { $divide: ["$totalRevenue", "$totalServices"] },
                  0,
                ],
              },
            },
          },
        ])
        .toArray(),

      // Revenue series (done only)
      db
        .collection("bookings")
        .aggregate([
          ...pipelineAddServiceDate,
          { $match: doneMatchByServiceDateExpr },
          {
            $group: {
              _id: {
                $dateTrunc: {
                  date: "$serviceDate",
                  unit: bucketUnit,
                  timezone: "UTC",
                },
              },
              revenue: { $sum: "$revenueValue" },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", revenue: 1 } },
        ])
        .toArray(),

      // Services series (done only)
      db
        .collection("bookings")
        .aggregate([
          ...pipelineAddServiceDate,
          { $match: doneMatchByServiceDateExpr },
          {
            $group: {
              _id: {
                $dateTrunc: {
                  date: "$serviceDate",
                  unit: bucketUnit,
                  timezone: "UTC",
                },
              },
              services: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", services: 1 } },
        ])
        .toArray(),

      // Customers series (done only) - unique by phoneRaw per bucket
      db
        .collection("bookings")
        .aggregate([
          ...pipelineAddServiceDate,
          { $match: doneMatchByServiceDateExpr },
          {
            $group: {
              _id: {
                bucket: {
                  $dateTrunc: {
                    date: "$serviceDate",
                    unit: bucketUnit,
                    timezone: "UTC",
                  },
                },
                phoneRaw: "$phoneRaw",
              },
            },
          },
          { $group: { _id: "$_id.bucket", customers: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", customers: 1 } },
        ])
        .toArray(),

      // Services by type (done only)
      db
        .collection("bookings")
        .aggregate([
          ...pipelineAddServiceDate,
          { $match: doneMatchByServiceDateExpr },
          {
            $group: {
              _id: "$service",
              count: { $sum: 1 },
              revenue: { $sum: "$revenueValue" },
            },
          },
          { $sort: { count: -1 } },
          { $project: { _id: 0, service: "$_id", count: 1, revenue: 1 } },
        ])
        .toArray(),

      // Funnel counts (created in range)
      db
        .collection("bookings")
        .aggregate([
          { $match: baseMatchCreatedRange },
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, status: "$_id", count: 1 } },
        ])
        .toArray(),
    ]);

    const kpis = kpisAgg?.[0] || {
      totalRevenue: 0,
      totalServices: 0,
      uniqueCustomers: 0,
      avgTicket: 0,
    };

    return NextResponse.json({
      range: { from, to, bucket },
      kpis,
      charts: {
        revenueByDate,
        servicesByDate,
        customersByDate,
        servicesByType,
        funnel: funnelAgg,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
