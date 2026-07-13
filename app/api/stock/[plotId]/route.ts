import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { generateOHLC } from "@/lib/stock-engine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plotId: string }> }
) {
  try {
    const { plotId } = await params;
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

    let plotObjectId: any = plotId;
    try {
      if (plotId.length === 24) {
        plotObjectId = new ObjectId(plotId);
      }
    } catch (e) {}

    const plot = await db.collection("plots").findOne({ _id: plotObjectId });

    const snapshots = await db.collection("performance_snapshots")
      .find({ plot_id: plotObjectId })
      .sort({ date: 1 })
      .toArray();

    let finalSnapshots = snapshots;

    if (!finalSnapshots || finalSnapshots.length === 0) {
      finalSnapshots = [];
      let baseTemp = 25;
      let baseMoisture = 40;
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        baseTemp += (Math.random() - 0.5) * 2;
        baseMoisture += (Math.random() - 0.5) * 5;
        finalSnapshots.push({
          date: date,
          metrics: {
            soil_score: 70 + Math.random() * 20,
            soil_moisture_avg: baseMoisture,
            temperature_avg: baseTemp
          },
          weather: {
            temp_avg: baseTemp
          },
          _id: new ObjectId
        });
      }
    }

    let basePrice = 100.0;
    if (plot && plot.expected_yield) {
      basePrice = plot.expected_yield * 0.5;
    }

    const ohlcData = generateOHLC(finalSnapshots, basePrice);

    return NextResponse.json({
      plotId,
      name: plot?.plot_id_string || `Plot ${plotObjectId.toString().substring(0, 6).toUpperCase()}`,
      basePrice,
      data: ohlcData
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
