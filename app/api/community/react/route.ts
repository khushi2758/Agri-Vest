import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("agrivest_db");

    const post = await db.collection("feedback").findOne({ _id: new ObjectId(postId) });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.reactedBy && post.reactedBy.includes(payload.sub)) {
      return NextResponse.json({ error: "Already reacted" }, { status: 400 });
    }

    await db.collection("feedback").updateOne(
      { _id: new ObjectId(postId) },
      { 
        $inc: { upvotes: 1 },
        $push: { reactedBy: payload.sub } as any
      }
    );

    const author = await db.collection("users").findOne({ _id: new ObjectId(post.authorId) });
    if (author) {
      const newReputation = (author.reputation || 0) + 5;
      const newTrustValue = Math.min(100, Math.floor(50 + (newReputation * 0.5)));
      
      await db.collection("users").updateOne(
        { _id: new ObjectId(post.authorId) },
        { 
          $set: { 
            reputation: newReputation,
            trust_value: newTrustValue
          } 
        }
      );
    }

    return NextResponse.json({ success: true, upvotes: post.upvotes + 1 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
