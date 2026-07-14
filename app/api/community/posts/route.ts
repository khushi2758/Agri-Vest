import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");
    const posts = await db.collection("feedback").find({}).sort({ created_at: -1 }).toArray();

    return NextResponse.json(posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      authorId: post.authorId.toString()
    })), { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const newPost = {
      content,
      authorId: new ObjectId(payload.sub),
      authorName: payload.name,
      authorRoles: payload.roles || [],
      upvotes: 0,
      reactedBy: [],
      created_at: new Date()
    };

    const result = await db.collection("feedback").insertOne(newPost);
    
    return NextResponse.json({ 
      success: true, 
      post: { ...newPost, _id: result.insertedId.toString(), authorId: payload.sub } 
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
