import { NextResponse } from "next/server";
import { generateOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const code = generateOTP(email);
    
    await sendOTPEmail(email, code);

    return NextResponse.json({ success: true, message: "OTP sent" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
