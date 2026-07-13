import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "default_super_secret_key_12345";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function comparePassword(password: string, hash: string): boolean {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey);
}

export function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(`${header}.${data}`).digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const [header, data, signature] = token.split(".");
    const expectedSignature = createHmac("sha256", SECRET).update(`${header}.${data}`).digest("base64url");
    if (signature !== expectedSignature) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch (e) {
    return null;
  }
}
