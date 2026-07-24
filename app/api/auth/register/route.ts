import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, signToken } from "@/lib/auth";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email, name, password, roles, phone, preferred_language, otp } = await request.json();

    if (!email || !name || !password || !roles || !roles.length || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!verifyOTP(email, otp)) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.collection("users").findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const password_hash = hashPassword(password);
    const now = new Date();

    const newUser = {
      email: normalizedEmail,
      name,
      role: roles.includes("admin") ? "admin" : roles.includes("agronomist") ? "agronomist" : roles.includes("agri_tech") ? "agri_tech" : (roles.includes("farmer") || roles.includes("landowner") ? "landowner" : "investor"),
      roles: roles,
      password_hash,
      phone: phone || "+10000000000",
      preferred_language: preferred_language || "en",
      created_at: now,
      updated_at: now,
      is_active: true,
      last_login: now,
      kyc: {
        verified: false
      },
      wallet: {
        balance: "0.00",
        currency: "AGV"
      }
    };

    const result = await db.collection("users").insertOne(newUser);
    
    const token = signToken({ sub: result.insertedId.toString(), roles, email, name });

    const response = NextResponse.json({ success: true }, { status: 201 });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
