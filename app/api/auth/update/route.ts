import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, preferred_language } = await request.json();

    if (!name || !phone || !preferred_language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    const userObjectId = new ObjectId(payload.sub);

    const updateResult = await db.collection("users").updateOne(
      { _id: userObjectId },
      { 
        $set: { 
          name, 
          phone, 
          preferred_language,
          updated_at: new Date()
        } 
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: "Profile not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
