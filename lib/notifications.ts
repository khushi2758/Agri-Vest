import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function createNotification(userId: string, title: string, message: string, type: "info" | "success" | "warning" | "error" = "info") {
  try {
    const client = await clientPromise;
    const db = client.db("agrivest_db");
    
    const notification = {
      userId: new ObjectId(userId),
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date()
    };
    
    await db.collection("notifications").insertOne(notification);
    return true;
  } catch (error) {
    return false;
  }
}
