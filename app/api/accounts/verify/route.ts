export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import POP3 from 'poplib';

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
  const b = await req.json();
  await verifySMTP({ host: b.smtp_host, port: b.smtp_port, secure: b.smtp_secure, user: b.username, pass: b.password });
  if (b.incoming_protocol === 'imap') await verifyIMAP({ host: b.incoming_host, port: b.incoming_port, secure: b.incoming_secure, user: b.username, pass: b.password });
  else if (b.incoming_protocol === 'pop3') await verifyPOP({ host: b.incoming_host, port: b.incoming_port, secure: b.incoming_secure, user: b.username, pass: b.password });
  else return NextResponse.json({ error: 'incoming_protocol must be imap or pop3' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
