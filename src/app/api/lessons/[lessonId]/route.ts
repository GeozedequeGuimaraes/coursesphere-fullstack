import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { forbidden, unauthorized, validationError } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeLesson } from "@/lib/serializers";
import { lessonSchema } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ lessonId: string }>;
};

async function findLessonForUser(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });

  if (!lesson) {
    return { lesson: null, allowed: false };
  }

  return { lesson, allowed: lesson.course.creatorId === userId };
}

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { lessonId } = await params;
  const { lesson, allowed } = await findLessonForUser(lessonId, user.id);

  if (!lesson) {
    return NextResponse.json({ message: "Aula não encontrada." }, { status: 404 });
  }

  if (!allowed) {
    return forbidden();
  }

  try {
    const data = lessonSchema.parse(await request.json());
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.title,
        status: data.status,
        videoUrl: data.videoUrl || null,
      },
    });

    return NextResponse.json({ lesson: serializeLesson(updatedLesson) });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível atualizar a aula." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { lessonId } = await params;
  const { lesson, allowed } = await findLessonForUser(lessonId, user.id);

  if (!lesson) {
    return NextResponse.json({ message: "Aula não encontrada." }, { status: 404 });
  }

  if (!allowed) {
    return forbidden();
  }

  await prisma.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ message: "Aula excluída." });
}
