import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const record = await prisma.verificationToken.findFirst({ where: { token } });
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() }
  });
  await prisma.verificationToken.delete({ where: { token } });
  return NextResponse.redirect(new URL('/auth/verified', req.url));
}
