import nodemailer from "nodemailer";

const globalWithOtp = global as typeof globalThis & {
  _otpStore?: Map<string, { code: string; expiresAt: number }>;
};

if (!globalWithOtp._otpStore) {
  globalWithOtp._otpStore = new Map();
}
const otpStore = globalWithOtp._otpStore;
export function generateOTP(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 
  });
  return code;
}

export function verifyOTP(email: string, code: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const record = otpStore.get(normalizedEmail);
  if (!record) return false;
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return false;
  }
  
  if (record.code === String(code).trim()) {
    otpStore.delete(normalizedEmail);
    return true;
  }
  
  return false;
}

export async function sendOTPEmail(email: string, code: string) {
    console.log(`\n\n========== OTP GENERATED ==========`);
    console.log(`OTP for ${email}: ${code}`);
    console.log(`===================================\n\n`);
    
    return true;
}
