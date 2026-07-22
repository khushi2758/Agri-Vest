import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Binary } from "mongodb";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const result = await db.collection("files").insertOne({
      filename: file.name,
      contentType: file.type,
      data: new Binary(buffer),
      uploadDate: new Date()
    });

    return NextResponse.json({ 
      url: `/api/files/${result.insertedId.toString()}` 
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
