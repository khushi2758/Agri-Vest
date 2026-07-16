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

    const { name, phone, preferred_language, roles, gender, id_number, tax_id, tax_country, address } = await request.json();

    if (!name || !phone || !preferred_language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    const userObjectId = new ObjectId(payload.sub);

    const updateFields: any = {
      name, 
      phone, 
      preferred_language,
      updated_at: new Date()
    };

    if (roles && Array.isArray(roles) && roles.length > 0) {
      updateFields.roles = roles;
      if (roles.includes("agronomist")) updateFields.role = "agronomist";
      else if (roles.includes("farmer")) updateFields.role = "farmer";
      else updateFields.role = "investor";
    }

    if (gender !== undefined) updateFields.gender = gender;
    if (id_number !== undefined) updateFields.id_number = id_number;
    if (tax_id !== undefined) updateFields.tax_id = tax_id;
    if (tax_country !== undefined) updateFields.tax_country = tax_country;
    if (address !== undefined) updateFields.address = address;

    const updateResult = await db.collection("users").updateOne(
      { _id: userObjectId },
      { $set: updateFields }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: "Profile not found or no changes made" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
    
    response.cookies.set("NEXT_LOCALE", preferred_language, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
