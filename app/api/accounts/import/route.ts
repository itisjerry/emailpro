export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import POP3 from 'poplib';
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

  const { accounts } = await req.json();
  if (!Array.isArray(accounts)) return NextResponse.json({ error: 'accounts must be an array' }, { status: 400 });

  let ok = 0, fail = 0, errors: any[] = [];
  for (const a of accounts) {
    try {
      await verifySMTP({ host: a.smtp_host, port: a.smtp_port, secure: a.smtp_secure, user: a.username, pass: a.password });
      if (a.incoming_protocol === 'imap') await verifyIMAP({ host: a.incoming_host, port: a.incoming_port, secure: a.incoming_secure, user: a.username, pass: a.password });
      else if (a.incoming_protocol === 'pop3') await verifyPOP({ host: a.incoming_host, port: a.incoming_port, secure: a.incoming_secure, user: a.username, pass: a.password });
      else throw new Error('incoming_protocol must be imap or pop3');

      const creds = encrypt(JSON.stringify({
        username: a.username, password: a.password,
        incoming_protocol: a.incoming_protocol, incoming_host: a.incoming_host, incoming_port: a.incoming_port, incoming_secure: a.incoming_secure,
        smtp_host: a.smtp_host, smtp_port: a.smtp_port, smtp_secure: a.smtp_secure
      }));

      await prisma.emailAccount.create({
        data: {
          userId: me.id,
          provider: 'smtp',
          address: a.email,
          displayName: a.displayName || null,
          meta: { creds },
          dailyLimit: Number(a.dailyLimit || 100)
        }
      });
      ok++;
    } catch (e: any) {
      fail++;
      errors.push({ email: a.email, error: e?.message || String(e) });
    }
  }

  return NextResponse.json({ ok, fail, errors });
}
