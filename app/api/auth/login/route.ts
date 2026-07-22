import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { comparePassword, signToken } from "@/lib/auth";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email, password, otp } = await request.json();

    if (!email || !password || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!verifyOTP(email, otp)) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.collection("users").findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { last_login: new Date() } }
    );

    const token = signToken({ sub: user._id.toString(), roles: user.roles || (user.role ? [user.role] : []), email: user.email, name: user.name });

    const response = NextResponse.json({ success: true }, { status: 200 });
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
