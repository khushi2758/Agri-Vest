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

    const allTransactions = await db.collection("transactions")
      .find({ user_id: userObjectId })
      .sort({ created_at: -1 })
      .toArray();

    const transactions = allTransactions.slice(0, 10);

    const investments = await db.collection("investments")
      .find({ investor_id: userObjectId })
      .toArray();

    const totalBalanceNum = parseFloat(user.wallet?.balance?.toString().replace(/,/g, '') || "0");
    const displayBalance = totalBalanceNum;

    const totalInvestments = investments.reduce((sum, inv) => sum + parseFloat(inv.amount?.toString().replace(/,/g, '') || "0"), 0);
    const averageAnnualRate = displayBalance * 0.05;

    const now = new Date();
    const months: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        monthName: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        netChange: 0,
        investmentChange: 0
      });
    }

    allTransactions.forEach(tx => {
      if (!tx.created_at) return;
      const txDate = new Date(tx.created_at);
      const m = months.find(m => m.year === txDate.getFullYear() && m.month === txDate.getMonth());
      if (m) {
        const amount = parseFloat(tx.amount?.toString().replace(/,/g, '') || "0");
        if (tx.direction === "credit") {
          m.netChange += amount;
        } else if (tx.direction === "debit") {
          m.netChange -= amount;
        }
      }
    });

    investments.forEach(inv => {
       if (!inv.created_at) return;
       const txDate = new Date(inv.created_at);
       const m = months.find(m => m.year === txDate.getFullYear() && m.month === txDate.getMonth());
       if (m) {
          m.investmentChange += parseFloat(inv.amount?.toString().replace(/,/g, '') || "0");
       }
    });

    let runningBalance = displayBalance;
    const dynamicBalanceData = [];
    const dynamicInvestmentData = [];
    let runningInvestment = totalInvestments;

    for (let i = months.length - 1; i >= 0; i--) {
      dynamicBalanceData.unshift({
        month: months[i].monthName,
        balance: runningBalance > 0 ? runningBalance : 0
      });
      dynamicInvestmentData.unshift({
        month: months[i].monthName,
        value: runningInvestment > 0 ? runningInvestment : 0
      });
      runningBalance -= months[i].netChange;
      runningInvestment -= months[i].investmentChange;
    }

    const formattedTransactions = transactions.map(tx => ({
        id: tx._id.toString(),
        name: tx.type === "deposit" ? "Wallet Deposit" : 
              tx.type === "withdrawal" ? "Wallet Withdrawal" : 
              tx.type === "investment" ? "Property Investment" :
              tx.type === "return_payout" ? "Farm Yield Payout" : "Transaction",
        date: tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "Unknown",
        rawAmount: parseFloat(tx.amount?.toString().replace(/,/g, '') || "0"),
        type: tx.direction === "credit" ? "in" : "out"
    }));

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
      balanceData: dynamicBalanceData,
      investmentData: dynamicInvestmentData,
      transactions: formattedTransactions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
