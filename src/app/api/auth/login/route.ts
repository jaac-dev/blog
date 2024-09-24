import { login } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await login(username, password);

  return NextResponse.json({
    ok: user != null,
    message: user == null ? "Incorrect username/password." : undefined,
    user: user
      ? {
          ...user,
          password: undefined,
        }
      : undefined,
  });
}
