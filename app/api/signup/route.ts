import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { v4 as uuid } from 'uuid';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash: hash }
  });

  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires }
  });

  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/verify?token=${token}`;

  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured; printing verification URL:');
    console.warn(url);
  } else {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Verify your EmailPro account',
      html: `<p>Hi ${name},</p><p>Please verify your account by clicking the link below:</p><p><a href="${url}">${url}</a></p>`
    });
  }

  return NextResponse.json({ ok: true });
}
