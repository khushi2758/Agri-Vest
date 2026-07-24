import { NextResponse } from "next/server";
import { addTransaction } from "@/lib/ledger";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.email || !decoded.sub) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userEmail = decoded.email;
    const userId = decoded.sub;
    const body = await request.json();
    
    const amount = parseFloat(body.amount?.toString().replace(/,/g, ''));
    const propertyId = body.propertyId;

    if (isNaN(amount) || amount <= 0 || !propertyId) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = parseFloat(user.wallet?.balance?.toString().replace(/,/g, '') || "0");
    if (currentBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance for this investment" }, { status: 400 });
    }

    await addTransaction(userEmail, "SYSTEM_POOL", amount, "INVESTMENT");

    const investmentRes = await db.collection("investments").insertOne({
      investor_id: new ObjectId(userId),
      plot_id: new ObjectId(), // Schema requires ObjectId
      type: "equity", // Schema requires 'equity' or 'factor_allocation'
      amount: amount.toFixed(2), // Ensure exactly 2 decimal places for regex
      status: "active",
      invested_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });

    await db.collection("transactions").insertOne({
      user_id: new ObjectId(userId),
      investment_id: investmentRes.insertedId,
      type: "withdrawal", 
      amount: amount.toFixed(2),
      currency: "AGV",
      direction: "debit",
      status: "completed",
      note: `Investment in property ${propertyId}`,
      created_at: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      investedAGV: amount
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
