import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      message: "Revise os campos informados.",
      errors: error.flatten().fieldErrors,
    },
    { status: 422 },
  );
}

export function unauthorized() {
  return NextResponse.json({ message: "Faça login para continuar." }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json(
    { message: "Você não tem permissão para esta ação." },
    { status: 403 },
  );
}
