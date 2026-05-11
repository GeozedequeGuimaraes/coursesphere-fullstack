import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { forbidden, unauthorized, validationError } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeLesson } from "@/lib/serializers";
import { courseSchema, lessonSchema } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ courseId: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { courseId } = await params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    return NextResponse.json({ message: "Curso não encontrado." }, { status: 404 });
  }

  if (course.creatorId !== user.id) {
    return forbidden();
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      courseId,
      ...(status === "draft" || status === "published" ? { status } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ lessons: lessons.map(serializeLesson) });
}

export async function POST(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { courseId } = await params;

  try {
    const body = await request.json();
    const data = lessonSchema.parse(body);
    let course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course && body.course) {
      const courseData = courseSchema.parse(body.course);

      course = await prisma.course.create({
        data: {
          id: courseId,
          name: courseData.name,
          description: courseData.description || null,
          startDate: new Date(courseData.startDate),
          endDate: new Date(courseData.endDate),
          creatorId: user.id,
        },
      });
    }

    if (!course) {
      return NextResponse.json({ message: "Curso não encontrado." }, { status: 404 });
    }

    if (course.creatorId !== user.id) {
      return forbidden();
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        status: data.status,
        videoUrl: data.videoUrl || null,
        courseId,
      },
    });

    return NextResponse.json({ lesson: serializeLesson(lesson) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível criar a aula." }, { status: 500 });
  }
}
