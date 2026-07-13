import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    const userObjectId = new ObjectId(decoded.sub);

    const user = await db.collection("users").findOne({ _id: userObjectId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transactions = await db.collection("transactions")
      .find({ user_id: userObjectId })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    const investments = await db.collection("investments")
      .find({ investor_id: userObjectId })
      .toArray();

    const baseBalanceData = [
      { month: "Sep", balance: 5200 },
      { month: "Oct", balance: 6800 },
      { month: "Nov", balance: 5100 },
      { month: "Dec", balance: 9780.90 },
      { month: "Jan", balance: 8400 },
      { month: "Feb", balance: parseFloat(user.wallet?.balance || "0") || 10120.50 }
    ];

    const baseInvestmentData = [
      { month: "Sep", value: 200 },
      { month: "Oct", value: 300 },
      { month: "Nov", value: 400 },
      { month: "Dec", value: 400 },
      { month: "Jan", value: 500, highlight: true },
      { month: "Feb", value: investments.length > 0 ? investments.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0) : 400 }
    ];

    const formattedTransactions = transactions.length > 0 
      ? transactions.map(tx => ({
          id: tx._id.toString(),
          name: tx.type === "deposit" ? "Wallet Deposit" : tx.type === "return_payout" ? "Farm Yield Payout" : "Transaction",
          date: new Date(tx.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          rawAmount: parseFloat(tx.amount),
          type: tx.direction === "credit" ? "in" : "out"
        }))
      : [
          { id: "tx1", name: "Syndicate Farm", date: "20 Jan, 02:00 PM", rawAmount: 1250.00, type: "in" },
          { id: "tx2", name: "Agri-Tech Fees", date: "20 Jan, 02:00 PM", rawAmount: 55.00, type: "out" },
          { id: "tx3", name: "Withdrawal", date: "19 Jan, 02:00 PM", rawAmount: 500.00, type: "out" }
        ];

    const totalBalanceNum = parseFloat(user.wallet?.balance || "0");
    const displayBalance = totalBalanceNum > 0 ? totalBalanceNum : 10120.50;
    
    const averageAnnualRate = displayBalance * 1.05;

    const totalInvestments = investments.length > 0 
      ? investments.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0) 
      : 3200.00;

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        kyc_verified: user.kyc?.verified || false,
        totalBalance: displayBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        averageAnnualRate: averageAnnualRate.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        totalInvestments: totalInvestments.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
      },
      balanceData: baseBalanceData,
      investmentData: baseInvestmentData,
      transactions: formattedTransactions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
