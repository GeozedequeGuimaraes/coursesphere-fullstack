import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { ensureDatabase, prisma } from "@/lib/prisma";
import { validationError } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    await ensureDatabase();

    const data = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return NextResponse.json(
        { message: "Email ou senha inválidos." },
        { status: 401 },
      );
    }

    const token = await createSessionToken({ userId: user.id });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error);
    }

    return NextResponse.json({ message: "Não foi possível entrar." }, { status: 500 });
  }
}
