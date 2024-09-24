import { register } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await register(username, password);

  return NextResponse.json({
    ok: user != null,
    message: user == null && "Failed to register user.",
    user: user
      ? {
          ...user,
          password: undefined,
        }
      : undefined,
  });
}
