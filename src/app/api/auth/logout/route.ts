import { logout } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  await logout();

  return NextResponse.json({
    ok: true,
  });
}
