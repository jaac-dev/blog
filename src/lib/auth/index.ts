"server-only";

import { User } from "@prisma/client";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "../prisma";
import { NextRequest, NextResponse } from "next/server";

export type Handler = (req: NextRequest) => Promise<void> | void;

export type Session = {
  id: number;
};

export async function getSession() {
  return await getIronSession<Session>(cookies(), {
    cookieName: "session",
    password: process.env.SECRET,
  });
}

export async function login(
  githubId: number
): Promise<User | null> {
  let user = await prisma.user.findFirst({
    where: {
      githubId,
    },
  });

  if (!user)
    user = await prisma.user.create({
      data: {
        githubId,
      },
    });

  const session = await getSession();
  session.id = user.id;
  await session.save();

  return user;
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

export function protect(inner: Handler): Handler {
  return async (req: NextRequest) => {
    const session = await getSession();

    return inner(req);
  };
}
