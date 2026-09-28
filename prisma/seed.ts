import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@skillverse.local" },
    update: {},
    create: {
      name: "SkillVerse Admin",
      email: "admin@skillverse.local",
      passwordHash,
      role: "ADMIN"
    }
  });

  const category = await prisma.category.upsert({
    where: { name: "Featured Courses" },
    update: {},
    create: { name: "Featured Courses" }
  });

  await prisma.course.upsert({
    where: { slug: "welcome-course" },
    update: {},
    create: {
      title: "Welcome to SkillVerse Academy",
      slug: "welcome-course",
      description: "Your first course. Edit or delete it from the admin dashboard.",
      price: 0,
      published: true,
      categoryId: category.id
    }
  });
}

main().finally(() => prisma.$disconnect());