import React from "react";

export default function Page() {
  return (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      >
        Login
      </a>
    </div>
  );
}
