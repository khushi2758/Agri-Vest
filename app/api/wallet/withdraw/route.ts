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

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = parseFloat(user.wallet?.balance?.toString().replace(/,/g, '') || "0");
    if (currentBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    await addTransaction(userEmail, "SYSTEM_WITHDRAWAL", amount, "WITHDRAWAL");

    await db.collection("transactions").insertOne({
      user_id: new ObjectId(userId),
      type: "withdrawal",
      amount: amount.toString(),
      currency: "AGV",
      direction: "debit",
      status: "completed",
      note: "Withdrawal to bank account",
      created_at: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      withdrawnAGV: amount
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
