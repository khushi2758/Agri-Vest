import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
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

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const lands = await db.collection("land_parcels").find({}).toArray();
    const telemetries = await db.collection("sensor_readings").find({}).toArray();

    const data = lands.map(land => {
      const telemetry = telemetries.find(t => t.propertyId === land.id) || {
        npkIndex: Math.floor(Math.random() * 40) + 40,
        moisturePct: Math.floor(Math.random() * 40) + 20,
        tempCelsius: Math.floor(Math.random() * 20) + 10
      };
      
      return {
        ...land,
        _id: land._id.toString(),
        telemetry
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
