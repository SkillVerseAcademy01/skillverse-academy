import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const [courses, categories, enrollments] = await Promise.all([
    prisma.course.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.enrollment.count()
  ]);

  return (
    <AdminClient
      initialCourses={courses.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() }))}
      categories={categories}
      enrollmentCount={enrollments}
    />
  );
}