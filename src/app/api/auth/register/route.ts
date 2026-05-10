import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { validationError } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    await ensureDatabase();

    const data = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este email já está cadastrado." },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: await bcrypt.hash(data.password, 10),
      },
      select: { id: true, name: true, email: true },
    });

    const token = await createSessionToken({ userId: user.id });
    await setSessionCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível criar a conta." }, { status: 500 });
  }
}
