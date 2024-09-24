import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params: { id } }: { params: { id: number } }
) {
  return NextResponse.json({
    post: await prisma.post.findFirst({
      where: {
        id,
      },
    }),
  });
}
