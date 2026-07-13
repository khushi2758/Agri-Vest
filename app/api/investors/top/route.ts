import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const users = await db.collection("users")
      .find({ role: "investor" })
      .sort({ "wallet.balance": -1 })
      .limit(5)
      .toArray();

    if (users && users.length > 0) {
      const formatted = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        roi: `+${(Math.random() * 20 + 5).toFixed(2)}%`,
        focus: u.preferred_language === "es" ? "South America" : "Global Markets",
        followers: Math.floor(Math.random() * 5000 + 100),
        avatar: u.name.substring(0, 2).toUpperCase()
      }));
      return NextResponse.json(formatted);
    }

    const mockData = [
      { id: "mock1", name: "Elena Rostova", roi: "+34.2%", focus: "Sustainable Orchards", followers: 12450, avatar: "ER" },
      { id: "mock2", name: "Marcus Thorne", roi: "+28.5%", focus: "Wheat & Grain", followers: 8930, avatar: "MT" },
      { id: "mock3", name: "Aisha Patel", roi: "+22.1%", focus: "Agri-Tech Solar", followers: 5620, avatar: "AP" },
      { id: "mock4", name: "David Chen", roi: "+19.8%", focus: "Vineyards", followers: 4100, avatar: "DC" },
      { id: "mock5", name: "Sarah Jenkins", roi: "+15.4%", focus: "Mixed Livestock", followers: 2890, avatar: "SJ" }
    ];

    return NextResponse.json(mockData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
