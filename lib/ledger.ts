import { createHash, randomUUID } from "crypto";
import clientPromise from "./mongodb";

export interface LedgerTransaction {
  _id?: any;
  txId: string;
  sender: string;
  receiver: string;
  amountAGV: number;
  type: string;
  timestamp: Date;
  previousHash: string;
  hash: string;
}

export function generateHash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function getLastTransaction(): Promise<LedgerTransaction | null> {
  const client = await clientPromise;
  const db = client.db("agrivest_db");
  const lastTx = await db.collection("agv_ledger")
    .find()
    .sort({ timestamp: -1, _id: -1 })
    .limit(1)
    .toArray();
  
  if (lastTx.length === 0) return null;
  return lastTx[0] as LedgerTransaction;
}

export async function addTransaction(
  sender: string,
  receiver: string,
  amountAGV: number,
  type: string
): Promise<LedgerTransaction> {
  const client = await clientPromise;
  const db = client.db("agrivest_db");

  const lastTx = await getLastTransaction();
  const previousHash = lastTx ? lastTx.hash : "0000000000000000000000000000000000000000000000000000000000000000";

  const txId = randomUUID();
  const timestamp = new Date();
  
  const payloadToHash = `${txId}:${sender}:${receiver}:${amountAGV}:${type}:${timestamp.toISOString()}:${previousHash}`;
  const hash = generateHash(payloadToHash);

  const newTx: LedgerTransaction = {
    txId,
    sender,
    receiver,
    amountAGV,
    type,
    timestamp,
    previousHash,
    hash
  };

  await db.collection("agv_ledger").insertOne({ ...newTx });
  
  if (receiver !== "SYSTEM_FEE_POOL" && receiver !== "SYSTEM_MINT") {
    const userRef = await db.collection("users").findOne({ email: receiver });
    if (userRef) {
      const currentBal = parseFloat(userRef.wallet?.balance || "0");
      await db.collection("users").updateOne(
        { email: receiver },
        { $set: { "wallet.balance": (currentBal + amountAGV).toFixed(2), "wallet.currency": "AGV" } }
      );
    }
  }

  if (sender !== "SYSTEM_MINT") {
    const userRef = await db.collection("users").findOne({ email: sender });
    if (userRef) {
      const currentBal = parseFloat(userRef.wallet?.balance || "0");
      await db.collection("users").updateOne(
        { email: sender },
        { $set: { "wallet.balance": (currentBal - amountAGV).toFixed(2), "wallet.currency": "AGV" } }
      );
    }
  }

  return newTx;
}

export async function verifyLedgerIntegrity(): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("agrivest_db");
  const allTx = await db.collection("agv_ledger")
    .find()
    .sort({ timestamp: 1 })
    .toArray() as LedgerTransaction[];

  let expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  for (const tx of allTx) {
    if (tx.previousHash !== expectedPrevHash) {
      return false;
    }
    
    const payloadToHash = `${tx.txId}:${tx.sender}:${tx.receiver}:${tx.amountAGV}:${tx.type}:${new Date(tx.timestamp).toISOString()}:${tx.previousHash}`;
    const calculatedHash = generateHash(payloadToHash);
    
    if (calculatedHash !== tx.hash) {
      return false;
    }
    expectedPrevHash = tx.hash;
  }

  return true;
}
