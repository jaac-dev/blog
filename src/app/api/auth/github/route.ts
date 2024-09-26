import { exchangeAndFetch } from "@/lib/auth/github";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const { id, username } = await exchangeAndFetch(code);
  console.log(`ID=${id} | Username=${username}`);
}
