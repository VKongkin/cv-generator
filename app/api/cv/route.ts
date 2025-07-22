import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { cvs: { orderBy: { updatedAt: "desc" }, take: 1 } },
  });
  if (!user || user.cvs.length === 0) {
    return new Response(JSON.stringify({ cv: null }), { status: 200 });
  }
  return new Response(JSON.stringify({ cv: user.cvs[0] }), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }
  const { data } = await req.json();
  // Upsert: update if exists, else create
  const latestCV = await prisma.cV.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  let cv;
  if (latestCV) {
    cv = await prisma.cV.update({ where: { id: latestCV.id }, data: { data } });
  } else {
    cv = await prisma.cV.create({ data: { userId: user.id, data } });
  }
  return new Response(JSON.stringify({ cv }), { status: 200 });
}
