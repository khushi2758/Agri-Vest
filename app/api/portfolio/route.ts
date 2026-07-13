import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
    const db = client.db("agrivest");
    const userObjectId = new ObjectId(decoded.sub);

    const investments = await db.collection("investments").find({ investor_id: userObjectId }).toArray();

    if (investments.length === 0) {
      return NextResponse.json({
        hasInvestments: false,
        kpi: {
          totalTasks: 0,
          completedTasks: 0,
          spentThisMonth: 0,
          spentThisYear: 0,
          timeBeforeDeadlineAvg: 0
        },
        timeline: []
      }, { status: 200 });
    }

    let totalTasks = 0;
    let completedTasks = 0;
    let spentThisMonth = 0;
    let spentThisYear = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalDaysLeft = 0;
    let projectsWithMaturity = 0;

    const timeline = investments.map(inv => {
      const investedAt = new Date(inv.invested_at);
      const maturityDate = inv.maturity_date ? new Date(inv.maturity_date) : new Date(investedAt.getTime() + 365 * 24 * 60 * 60 * 1000);
      
      const invAmount = parseFloat(inv.amount || "0");
      if (investedAt.getFullYear() === currentYear) {
        spentThisYear += invAmount;
        if (investedAt.getMonth() === currentMonth) {
          spentThisMonth += invAmount;
        }
      }

      let pTotal = 0;
      let pCompleted = 0;
      
      if (inv.allocations && Array.isArray(inv.allocations)) {
        pTotal = inv.allocations.length;
        pCompleted = inv.allocations.filter((a: any) => a.status === "completed").length;
        totalTasks += pTotal;
        completedTasks += pCompleted;
      } else {
        totalTasks += 1;
        if (inv.status === "matured") {
          completedTasks += 1;
          pCompleted = 1;
        }
        pTotal = 1;
      }

      if (inv.maturity_date && inv.status !== "matured") {
        const daysLeft = Math.max(0, Math.floor((maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        totalDaysLeft += daysLeft;
        projectsWithMaturity++;
      }

      return {
        id: inv._id.toString(),
        title: `Investment ${inv._id.toString().substring(0, 6).toUpperCase()}`,
        type: inv.type,
        amount: invAmount,
        status: inv.status,
        progress: pTotal > 0 ? (pCompleted / pTotal) * 100 : 0,
        startDate: investedAt.toISOString(),
        endDate: maturityDate.toISOString(),
        tasksTotal: pTotal,
        tasksCompleted: pCompleted
      };
    });

    const timeBeforeDeadlineAvg = projectsWithMaturity > 0 ? Math.floor((totalDaysLeft / projectsWithMaturity) / 30) : 0;

    return NextResponse.json({
      hasInvestments: true,
      kpi: {
        totalTasks,
        completedTasks,
        spentThisMonth,
        spentThisYear,
        timeBeforeDeadlineAvg
      },
      timeline
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
