import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    posts: await prisma.post.findMany(),
  });
}

export async function POST(req: NextRequest) {
  const { title, contents } = await req.json();

  const post = await prisma.post.create({
    data: {
      title,
      contents,
    },
  });

  return NextResponse.json({
    post,
  });
}
