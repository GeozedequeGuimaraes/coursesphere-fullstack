import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (process.env.VERCEL) {
  process.env.DATABASE_URL = "file:/tmp/coursesphere.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  databaseReady?: Promise<void>;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function setupDatabase() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Course" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME NOT NULL,
      "creatorId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Lesson" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'draft',
      "videoUrl" TEXT,
      "courseId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Course_creatorId_idx" ON "Course" ("creatorId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Lesson_courseId_idx" ON "Lesson" ("courseId")`);

  const passwordHash = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "teste@coursesphere.com" },
    update: {
      name: "Usuário Teste",
      passwordHash,
    },
    create: {
      id: "user_teste",
      name: "Usuário Teste",
      email: "teste@coursesphere.com",
      passwordHash,
    },
  });

  const course = await prisma.course.upsert({
    where: { id: "course_next_fullstack" },
    update: {},
    create: {
      id: "course_next_fullstack",
      name: "Next.js Full Stack",
      description: "Curso introdutório para construir aplicações full stack com Next.js.",
      startDate: new Date("2026-05-12T00:00:00.000Z"),
      endDate: new Date("2026-06-12T00:00:00.000Z"),
      creatorId: user.id,
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
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson_prisma_zod" },
    update: {},
    create: {
      id: "lesson_prisma_zod",
      title: "Validações com Zod e Prisma",
      status: "draft",
      courseId: course.id,
    },
  });
}

export function ensureDatabase() {
  globalForPrisma.databaseReady ??= setupDatabase();
  return globalForPrisma.databaseReady;
}
