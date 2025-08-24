import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { graphClient } from "@/lib/msgraph";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = graphClient((session as any).access_token);
  const me = await client.api("/me").get();
  return NextResponse.json(me);
}
