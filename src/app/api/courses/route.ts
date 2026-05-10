import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { unauthorized, validationError } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeCourse } from "@/lib/serializers";
import { courseSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();

  const courses = await prisma.course.findMany({
    where: {
      creatorId: user.id,
      ...(search
        ? {
            name: {
              contains: search,
            },
          }
        : {}),
    },
    include: {
      lessons: true,
    },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json({ courses: courses.map(serializeCourse) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  try {
    const data = courseSchema.parse(await request.json());
    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        creatorId: user.id,
      },
    });

    return NextResponse.json({ course: serializeCourse(course) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível criar o curso." }, { status: 500 });
  }
}
