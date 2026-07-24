import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function getPropertyName(ref: string) {
  if (!ref) return "Unknown Asset";
  return ref.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

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

    const investments = await db.collection("investments").find({ investor_id: userObjectId }).toArray();
    const transactions = await db.collection("transactions").find({ user_id: userObjectId }).sort({ created_at: -1 }).limit(20).toArray();

    if (investments.length === 0) {
      return NextResponse.json({
        hasInvestments: false,
        portfolioValue: 0,
        totalInvested: 0,
        netMultiple: 1.0,
        investmentsList: [],
        chartData: [],
        activitiesList: transactions.map(tx => ({
          id: tx._id.toString(),
          title: `New ${tx.type}`,
          subtitle: tx.note || `${tx.type} transaction`,
          date: new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amount: parseFloat(tx.amount || "0"),
          direction: tx.direction
        }))
      }, { status: 200 });
    }

    let totalInvested = 0;
    
    let oldestDate = new Date();
    investments.forEach(inv => {
      const d = new Date(inv.invested_at);
      if (d < oldestDate) oldestDate = d;
    });
    
    const daysSinceFirstInv = Math.max(1, (new Date().getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
    const netMultiple = Number((1.0 + (daysSinceFirstInv / 365) * 0.15).toFixed(2));

    const investmentsList = investments.map(inv => {
      const invAmount = parseFloat(inv.amount || "0");
      totalInvested += invAmount;
      
      const investedAt = new Date(inv.invested_at);
      
      return {
        id: inv._id.toString(),
        company: getPropertyName(inv.property_ref),
        status: inv.status === "active" ? "Live" : inv.status,
        date: investedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        invested: invAmount,
        netValue: invAmount * netMultiple,
        multiple: `${netMultiple}x`,
        rawDate: investedAt.getTime()
      };
    });

    const portfolioValue = totalInvested * netMultiple;

    const sortedInv = [...investmentsList].sort((a, b) => a.rawDate - b.rawDate);
    const chartData: any[] = [];
    let runningInvested = 0;
    
    sortedInv.forEach(inv => {
      runningInvested += inv.invested;
      const d = new Date(inv.rawDate);
      chartData.push({
        name: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        invested: runningInvested,
        released: runningInvested * 0.4
      });
    });
    
    chartData.push({
      name: "Now",
      invested: runningInvested,
      released: runningInvested * 0.6
    });

    const activitiesList = transactions.map(tx => ({
      id: tx._id.toString(),
      title: tx.type === "investment" ? "New Investment" : `New ${tx.type}`,
      subtitle: tx.note || `${tx.type} transaction`,
      date: new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: parseFloat(tx.amount || "0"),
      direction: tx.direction
    }));

    return NextResponse.json({
      hasInvestments: true,
      portfolioValue,
      totalInvested,
      netMultiple,
      investmentsList,
      chartData,
      activitiesList
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
