import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  const env = readFileSync(".env", "utf8");

  for (const line of env.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^"|"$/g, "");
    }
  }
}

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "teste@coursesphere.com" },
    update: {
      name: "Usuario Teste",
      passwordHash,
    },
    create: {
      id: "user_teste",
      name: "Usuario Teste",
      email: "teste@coursesphere.com",
      passwordHash,
      updatedAt: new Date(),
    },
  });

  const course = await prisma.course.upsert({
    where: { id: "course_next_fullstack" },
    update: {},
    create: {
      id: "course_next_fullstack",
      name: "Next.js Full Stack",
      description: "Curso introdutorio para construir aplicacoes full stack com Next.js.",
      startDate: new Date("2026-05-12T00:00:00.000Z"),
      endDate: new Date("2026-06-12T00:00:00.000Z"),
      creatorId: user.id,
      updatedAt: new Date(),
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson_app_router" },
    update: {},
    create: {
      id: "lesson_app_router",
      title: "Rotas com App Router",
      status: "published",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      courseId: course.id,
      updatedAt: new Date(),
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson_prisma_zod" },
    update: {},
    create: {
      id: "lesson_prisma_zod",
      title: "Validacoes com Zod e Prisma",
      status: "draft",
      courseId: course.id,
      updatedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
