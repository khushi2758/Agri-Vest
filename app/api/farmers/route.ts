import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");

    // Fetch users who are farmers (agronomist) or farmers explicitly
    const farmers = await db
      .collection("users")
      .find({
        $or: [
          { role: "agronomist" },
          { roles: "agronomist" },
          { roles: "farmer" }
        ],
        is_active: true
      })
      .project({ password_hash: 0, otp: 0 })
      .toArray();

    // Map DB documents to a cleaner frontend format
    const formattedFarmers = farmers.map((f, i) => ({
      id: f._id.toString(),
      name: f.name,
      avatar: f.name.charAt(0).toUpperCase(),
      email: f.email,
      phone: f.phone,
      location: f.location || "Global Farm Network",
      joined: f.created_at,
      crops: f.crops || ["Mixed Agriculture"],
    }));

    return NextResponse.json(formattedFarmers, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
