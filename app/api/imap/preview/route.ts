export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { ImapFlow } from "imapflow";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { host, port = 993, secure = true, user, pass, mailbox = "INBOX", limit = 5 } = body;

  if (!host || !user || !pass) {
    return NextResponse.json({ error: "IMAP creds missing" }, { status: 400 });
  }

  const client = new ImapFlow({ host, port, secure, auth: { user, pass } });
  await client.connect();
  const lock = await client.getMailboxLock(mailbox);
  try {
    const messages: any[] = [];
    // fetch last N messages
    let seq = `${Math.max(1, client.mailbox.exists - limit + 1)}:*`;
    for await (let msg of client.fetch(seq, { envelope: true, source: false })) {
      messages.push({
        uid: msg.uid,
        subject: msg.envelope?.subject,
                from: msg.envelope?.from?.map((a: any) => a.address).join(", "),
        date: msg.envelope?.date
      });
    }
    return NextResponse.json({ mailbox, total: client.mailbox.exists, messages });
  } finally {
    lock.release();
    await client.logout();
  }
}
