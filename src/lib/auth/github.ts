"server-only";

import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { Octokit } from "@octokit/rest";

export async function exchangeAndFetch(
  code: string
): Promise<{ id: number; username: string }> {
  const octo = new Octokit({
    authStrategy: createOAuthUserAuth,
    auth: {
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
  });

  const info = await octo.rest.users.getAuthenticated();
  return { id: info.data.id, username: info.data.name };
}
