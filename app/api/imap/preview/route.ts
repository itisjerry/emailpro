export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { ImapFlow } from "imapflow";

// (Simple, permissive types so Vercel/TS are happy)
type Any = any;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    host,
    port = 993,
    secure = true,
    user,
    pass,
    mailbox = "INBOX",
    limit = 5,
  } = body;

  if (!host || !user || !pass) {
    return NextResponse.json({ error: "IMAP creds missing" }, { status: 400 });
  }

  const client = new ImapFlow({ host, port, secure, auth: { user, pass } });
  await client.connect();

  const lock = await client.getMailboxLock(mailbox);
  try {
    const messages: Any[] = [];
    const total = client.mailbox?.exists || 0;
    const start = Math.max(1, total - limit + 1);
    const seq = `${start}:*`;

    // Loosen types for build stability on Vercel
    for await (const msg of (client.fetch as Any)(
      seq as Any,
      { envelope: true, source: false } as Any
    )) {
      messages.push({
        uid: (msg as Any).uid,
        subject: (msg as Any).envelope?.subject,
        from: (msg as Any).envelope?.from?.map((a: Any) => a.address).join(", "),
        date: (msg as Any).envelope?.date,
      });
    }

    return NextResponse.json({ mailbox, total, messages });
  } finally {
    lock.release();
    await client.logout();
  }
}
