import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  if (!(await getSessionUserId())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const courses = await prisma.course.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  if (!(await getSessionUserId())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const course = await prisma.course.create({
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