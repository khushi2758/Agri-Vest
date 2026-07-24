import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    let following: string[] = [];
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (token) {
      const payload = verifyToken(token);
      if (payload && payload.sub) {
        const currentUser = await db.collection("users").findOne({ _id: new (require("mongodb").ObjectId)(payload.sub) });
        if (currentUser && currentUser.following) {
          following = currentUser.following;
        }
      }
    }

    const users = await db.collection("users")
      .find({ role: "investor" })
      .sort({ "wallet.balance": -1 })
      .limit(5)
      .toArray();

    const formatted = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      roi: `+${(Math.random() * 20 + 5).toFixed(2)}%`,
      focus: u.preferred_language === "es" ? "South America" : "Global Markets",
      followers: Math.floor(Math.random() * 5000 + 100),
      avatar: u.name.substring(0, 2).toUpperCase()
    }));
    
    return NextResponse.json({ topInvestors: formatted, following });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
