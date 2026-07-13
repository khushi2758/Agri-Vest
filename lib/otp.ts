import nodemailer from "nodemailer";

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000 
  });
  return code;
}

export function verifyOTP(email: string, code: string): boolean {
  const record = otpStore.get(email);
  if (!record) return false;
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  
  if (record.code === code) {
    otpStore.delete(email);
    return true;
  }
  
  return false;
}

export async function sendOTPEmail(email: string, code: string) {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: '"Agri-Vest Security" <no-reply@agrivest.com>',
      to: email,
      subject: "Your Authentication OTP",
      text: `Your Agri-Vest verification code is: ${code}. It will expire in 10 minutes.`,
      html: `<b>Your Agri-Vest verification code is: <span style="font-size:24px;color:#c8e639;">${code}</span></b><br/><br/>It will expire in 10 minutes.`,
    });

    console.log(`\n\n========== OTP GENERATED ==========`);
    console.log(`OTP for ${email}: ${code}`);
    console.log(`Preview Email URL: ${nodemailer.getTestMessageUrl(info)}`);
    console.log(`===================================\n\n`);
    
    return true;
  } catch (error) {
    console.error("Failed to send OTP email", error);
    return false;
  }
}
