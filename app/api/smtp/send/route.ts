import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    host = process.env.SMTP_HOST,
    port = Number(process.env.SMTP_PORT || 587),
    secure = String(process.env.SMTP_SECURE || "false") === "true",
    user = process.env.SMTP_USER,
    pass = process.env.SMTP_PASS,
    from,
    to,
    subject,
    text,
    html
  } = body;

  if (!host || !port || !user || !pass) {
    return NextResponse.json({ error: "SMTP credentials missing" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  const info = await transporter.sendMail({ from: from || user, to, subject, text, html });
  return NextResponse.json({ messageId: info.messageId });
}
