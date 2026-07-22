import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "No file ID provided" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const fileDoc = await db.collection("files").findOne({ _id: new ObjectId(id) });
    if (!fileDoc || !fileDoc.data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = fileDoc.data.buffer;
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileDoc.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });

  } catch (err: any) {
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }
}
