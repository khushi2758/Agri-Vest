import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { calculateValidity } from "@/logic/validationModel";
import { ObjectId } from "mongodb";

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

    const { propertyId, npkIndex, moisturePct, tempCelsius, isFlagged, suggestion } = await request.json();

    if (!propertyId || npkIndex === undefined || moisturePct === undefined || tempCelsius === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = calculateValidity({
      npkIndex: Number(npkIndex),
      moisturePct: Number(moisturePct),
      tempCelsius: Number(tempCelsius),
      isFlagged: Boolean(isFlagged)
    });

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const validationRecord = {
      propertyId,
      agronomistId: payload.sub,
      timestamp: new Date(),
      suggestion,
      isFlagged,
      ...result
    };

    await db.collection("validations").insertOne(validationRecord);

    await db.collection("users").updateOne(
      { _id: new ObjectId(payload.sub) },
      { $inc: { credits: result.creditsEarned } }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
