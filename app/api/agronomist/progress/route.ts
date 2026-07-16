import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = verifyToken(token);
    if (!payload || !payload.sub || !payload.roles?.includes("agronomist")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const savedProgress = await db.collection("agronomist_progress").find({
      agronomistId: payload.sub,
      status: "draft"
    }).toArray();

    return NextResponse.json({ progress: savedProgress }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = verifyToken(token);
    if (!payload || !payload.sub || !payload.roles?.includes("agronomist")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, isFlagged, suggestion, status } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const filter = { agronomistId: payload.sub, propertyId };
    
    const update = {
      $set: {
        agronomistId: payload.sub,
        propertyId,
        isFlagged: isFlagged ?? false,
        suggestion: suggestion || "",
        status: status || "draft",
        updatedAt: new Date()
      }
    };

    await db.collection("agronomist_progress").updateOne(filter, update, { upsert: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
