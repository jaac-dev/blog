import { User } from "@prisma/client";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
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

export async function register(
  username: string,
  password: string
): Promise<User | null> {
  if ((await prisma.user.count({ where: { username } })) > 0) return null;

  const hash = await bcrypt.hash(password, SALT_LENGTH);
  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });

  const session = await getSession();
  session.id = user.id;
  await session.save();

  return user;
}

export async function login(
  username: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) return null;

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
