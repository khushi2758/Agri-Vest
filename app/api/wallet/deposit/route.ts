import { NextResponse } from "next/server";
import { addTransaction } from "@/lib/ledger";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userEmail = decoded.email;
    const body = await request.json();
    const fiatAmount = parseFloat(body.amount);

    if (isNaN(fiatAmount) || fiatAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const FEE_PERCENTAGE = 0.02;
    const feeAmount = fiatAmount * FEE_PERCENTAGE;
    const netAGV = fiatAmount - feeAmount;

    await addTransaction("SYSTEM_MINT", userEmail, netAGV, "DEPOSIT");

    await addTransaction("SYSTEM_MINT", "SYSTEM_FEE_POOL_EDUCATION", feeAmount, "FEE");

    return NextResponse.json({ 
      success: true, 
      depositedAGV: netAGV,
      feeAGV: feeAmount,
      totalFiatCharged: fiatAmount
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
