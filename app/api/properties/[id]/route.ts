import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;

    const client = await clientPromise;
    const db = client.db("agrivest");

    const property = await db.collection("land_parcels").findOne({ id: propertyId });
    
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const sensorData = await db.collection("sensor_readings").findOne({ propertyId: propertyId });

    const combinedData = {
      ...property,
      telemetry: sensorData || {
        npkIndex: 62,
        moisturePct: 35,
        lightIndex: 88,
        tempCelsius: 22
      }
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
