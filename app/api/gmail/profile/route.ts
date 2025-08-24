import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { gmailClient } from "@/lib/google";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gmail = gmailClient((session as any).access_token);
  const me = await gmail.users.getProfile({ userId: "me" });
  return NextResponse.json(me.data);
}
