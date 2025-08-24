export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import POP3 from 'poplib';
import { encrypt } from '@/lib/crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Any = any;

async function verifySMTP({ host, port, secure, user, pass }: Any) {
  const transporter = nodemailer.createTransport({ host, port: Number(port), secure: !!secure, auth: { user, pass } });
  await transporter.verify();
}
async function verifyIMAP({ host, port, secure, user, pass }: Any) {
  const client = new ImapFlow({ host, port: Number(port), secure: !!secure, auth: { user, pass } });
  await client.connect(); await client.logout();
}
function verifyPOP({ host, port, secure, user, pass }: Any) {
  return new Promise<void>((resolve, reject) => {
    const client = new POP3(Number(port), host, { tlserrs: false, enabletls: !!secure, debug: false });
    client.on('error', reject);
    client.on('connect', () => client.login(user, pass));
    client.on('login', (status: boolean) => status ? (client.quit(), resolve()) : reject(new Error('POP3 login failed')));
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    email, displayName, username, password,
    incoming_protocol, incoming_host, incoming_port, incoming_secure,
    smtp_host, smtp_port, smtp_secure,
    dailyLimit = 100
  } = body;

  if (!email || !username || !password || !smtp_host || !smtp_port) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await verifySMTP({ host: smtp_host, port: smtp_port, secure: smtp_secure, user: username, pass: password });
  if (incoming_protocol === 'imap') {
    await verifyIMAP({ host: incoming_host, port: incoming_port, secure: incoming_secure, user: username, pass: password });
  } else if (incoming_protocol === 'pop3') {
    await verifyPOP({ host: incoming_host, port: incoming_port, secure: incoming_secure, user: username, pass: password });
  } else return NextResponse.json({ error: 'incoming_protocol must be imap or pop3' }, { status: 400 });

  const creds = encrypt(JSON.stringify({
    username, password,
    incoming_protocol, incoming_host, incoming_port, incoming_secure,
    smtp_host, smtp_port, smtp_secure
  }));

  const saved = await prisma.emailAccount.create({
    data: {
      userId: me.id,
      provider: 'smtp',
      address: email,
      displayName: displayName || null,
      meta: { creds },
      dailyLimit: Number(dailyLimit)
    }
  });

  return NextResponse.json({ ok: true, id: saved.id });
}
