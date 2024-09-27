import { ApiResponse } from "@/lib/api";

import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { login } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<ApiResponse<any>> {
  const octo = new Octokit({
    authStrategy: createOAuthUserAuth,
    auth: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      code: req.nextUrl.searchParams.get("code"),
    },
  });

  try {
    const {data: {id}} = await octo.rest.users.getAuthenticated();

    const user = await login(id);

    NextResponse.redirect("/");
  } catch (err) {
    return {
      ok: false,
      message: "Failed to login user.",
    }
  }
}
