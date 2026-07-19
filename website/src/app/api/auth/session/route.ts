import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  userFromEmail,
  verifySessionToken,
} from "@/lib/auth-session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: userFromEmail(session.email),
  });
}
