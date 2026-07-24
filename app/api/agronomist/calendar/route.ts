import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.roles?.includes("agronomist")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const landId = searchParams.get("landId");

    if (!landId) {
      return NextResponse.json({ error: "landId is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    // Fetch the land parcel to get its calendar slots
    const land = await db.collection("land_parcels").findOne({ 
      $or: [{ id: landId }, { _id: landId }]
    });

    if (!land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    const slots = land.calendar_slots || [];

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("GET Calendar error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.roles?.includes("agronomist")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { landId, slots } = body;

    if (!landId || !Array.isArray(slots)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const result = await db.collection("land_parcels").updateOne(
      { $or: [{ id: landId }, { _id: landId }] },
      { $set: { calendar_slots: slots, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Calendar saved successfully" });
  } catch (error) {
    console.error("POST Calendar error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
