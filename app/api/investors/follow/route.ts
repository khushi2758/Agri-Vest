import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { targetUserId, action } = await request.json();
    if (!targetUserId || !['follow', 'unfollow'].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const updateQuery = action === 'follow' 
      ? { $addToSet: { following: targetUserId } }
      : { $pull: { following: targetUserId } };

    await db.collection("users").updateOne(
      { _id: new (require("mongodb").ObjectId)(payload.sub) },
      updateQuery as any
    );

    return NextResponse.json({ success: true, action, targetUserId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
