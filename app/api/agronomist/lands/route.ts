import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { FARMLANDS } from "@/lib/mock-farmlands";

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

    const dbLands = lands.map(land => {
      let lat = 39.5;
      let lng = -98.35;
      if (land.location && typeof land.location === 'object' && land.location.coordinates) {
        lng = land.location.coordinates[0];
        lat = land.location.coordinates[1];
      }
      
      return {
        _id: land._id.toString(),
        id: land.id || land._id.toString(),
        title: land.title || land.id || "Unknown Land",
        crop: land.crop || "Mixed",
        area: land.area || (land.area_ha ? `${land.area_ha} ha` : "N/A"),
        status: land.status || "active",
        locationStr: typeof land.location === 'string' ? land.location : `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`,
        lat,
        lng
      };
    });

    const mockLands = FARMLANDS.map(farm => ({
      _id: farm.id,
      id: farm.id,
      title: farm.name,
      crop: farm.cropType,
      area: farm.rotationDays ? `${farm.rotationDays} d` : "N/A",
      status: "active",
      locationStr: farm.location,
      lat: 39.5 + (Math.random() * 5 - 2.5),
      lng: -98.35 + (Math.random() * 5 - 2.5)
    }));

    return NextResponse.json([...dbLands, ...mockLands]);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
