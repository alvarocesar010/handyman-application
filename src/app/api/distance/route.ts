import { NextResponse } from "next/server";

interface DistanceRequestBody {
  eircode?: string;
}

interface DistanceApiResult {
  origin: string;
  destination: string;
  distance: string;
  duration: number; // minutes
  cost: number; // final calculated cost
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const GOOGLE_MAPS_ORIGIN =
    process.env.GOOGLE_MAPS_ORIGIN || "Dublin, Ireland";

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as DistanceRequestBody;
    const { eircode } = body;

    if (!eircode) {
      return NextResponse.json(
        { error: "Eircode is required" },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const params = new URLSearchParams({
      origins: GOOGLE_MAPS_ORIGIN,
      destinations: eircode,
      mode: "driving",
      units: "metric",
      key: apiKey,
      departure_time: now.toString(),
      traffic_model: "best_guess",
    });

    const url =
      "https://maps.googleapis.com/maps/api/distancematrix/json?" +
      params.toString();

    const response = await fetch(url);
    const data = await response.json();

    const row = data?.rows?.[0];
    const element = row?.elements?.[0];

    if (!element || element.status !== "OK") {
      return NextResponse.json(
        { error: "Could not calculate distance" },
        { status: 400 }
      );
    }

    // Convert duration -> minutes (number)
    const durationSeconds =
      element.duration_in_traffic?.value ?? element.duration.value;

    const durationMinutes = Math.round(durationSeconds / 60);

    // -------------------------
    // COST CALCULATION
    // -------------------------

    const hours = (durationMinutes * 2) / 60; // convert minutes -> hours
    const baseCost = hours * 50; // €50 per hour
    const cost = Number((baseCost * 1.3).toFixed(2)); // +30% margin of error

    // -------------------------

    const result: DistanceApiResult = {
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: element.distance.text,
      duration: durationMinutes,
      cost,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
