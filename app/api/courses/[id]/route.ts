import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUserId())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  const course = await prisma.course.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      price: Number(body.price || 0),
      categoryId: body.categoryId || null,
      published: body.published === true || body.published === "on"
    },
    include: { category: true }
  });
  return NextResponse.json(course);
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUserId())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}