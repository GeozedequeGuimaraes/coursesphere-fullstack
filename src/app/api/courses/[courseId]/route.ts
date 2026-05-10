import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { forbidden, unauthorized, validationError } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeCourse } from "@/lib/serializers";
import { courseSchema } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ courseId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { createdAt: "asc" } } },
  });

  if (!course) {
    return NextResponse.json({ message: "Curso não encontrado." }, { status: 404 });
  }

  if (course.creatorId !== user.id) {
    return forbidden();
  }

  return NextResponse.json({ course: serializeCourse(course) });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    return NextResponse.json({ message: "Curso não encontrado." }, { status: 404 });
  }

  if (course.creatorId !== user.id) {
    return forbidden();
  }

  try {
    const data = courseSchema.parse(await request.json());
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name: data.name,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    return NextResponse.json({ course: serializeCourse(updatedCourse) });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível atualizar o curso." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    return NextResponse.json({ message: "Curso não encontrado." }, { status: 404 });
  }

  if (course.creatorId !== user.id) {
    return forbidden();
  }

  await prisma.course.delete({ where: { id: courseId } });

  return NextResponse.json({ message: "Curso excluído." });
}
