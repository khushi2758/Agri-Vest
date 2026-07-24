import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { farmName, acreage, ownerName } = body;

    if (!farmName || !acreage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const newLand = {
      owner_id: new ObjectId(payload.id),
      title: farmName,
      area_ha: parseFloat(acreage) || 1.0,
      soil_type: "loamy",
      water_source: "borewell",
      status: "listed",
      location: {
        type: "Point",
        coordinates: [
          78.9629 + (Math.random() * 2 - 1), 
          20.5937 + (Math.random() * 2 - 1)
        ]
      },
      address: {
        village: "Unknown",
        district: "Unknown",
        state: "Unknown",
        pincode: "000000"
      },
      docs: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await db.collection("land_parcels").insertOne(newLand);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add farmland", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
