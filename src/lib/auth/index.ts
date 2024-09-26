"server-only";

import { User } from "@prisma/client";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "../prisma";
import { NextRequest, NextResponse } from "next/server";

export type Handler = (req: NextRequest) => Promise<void> | void;

const SALT_LENGTH = 16;

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
  id: number,
  username: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    const user = await prisma.user.create({
      data: {
        githubId: id,
        githubUsername: username,
      },
    });

    return;
  }

  const session = await getSession();
  session.id = user.id;
  await session.save();

  return user;
}

export async function logout() {
  const session = await getSession();
  await session.destroy();
}

export function protect(inner: Handler): Handler {
  return async (req: NextRequest) => {
    const session = await getSession();

    return inner(req);
  };
}
