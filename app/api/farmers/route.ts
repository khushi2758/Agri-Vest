import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const nearMe = url.searchParams.get("nearMe") === "true";

    const query: any = {
      $or: [
        { role: "agronomist" },
        { roles: "agronomist" },
        { roles: "farmer" }
      ],
      is_active: true
    };

    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } }
          ]
        }
      ];
    }

    if (nearMe) {
      // Mocking 'Near Me' by filtering users in a specific region or country (e.g., USA)
      if (query.$and) {
        query.$and.push({ location: { $regex: "USA", $options: "i" } });
      } else {
        query.$and = [{ location: { $regex: "USA", $options: "i" } }];
      }
    }

    const farmers = await db
      .collection("users")
      .find(query)
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
