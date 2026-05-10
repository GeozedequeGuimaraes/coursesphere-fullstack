"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/http";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { useAuthStore } from "@/store/auth-store";
import type { Usuario } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setMessage("");

    try {
      const response = await api<{ user: Usuario }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUsuario(response.user);
      router.push(searchParams.get("redirect") ?? "/dashboard");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Não foi possível entrar.");
    }
  }

  return (
    <section className="w-full max-w-md border-y border-[#cbe9d9] py-8">
      <Link className="mb-6 inline-flex items-center gap-2 font-semibold text-[#10201c] lg:hidden" href="/">
        CourseSphere
      </Link>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#247758]">
        Bem-vindo de volta
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#10201c]">
        Entrar
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Acesse a biblioteca de cursos e continue a organizar as aulas de onde parou.
      </p>

      <form className="mt-5 grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="seu@email.com" {...register("email")} />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" placeholder="Sua senha" {...register("password")} />
        </Field>
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Ainda não tem conta?{" "}
        <Link className="font-medium text-emerald-800 underline" href="/cadastro">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-600">Carregando login...</p>}>
      <LoginForm />
    </Suspense>
  );
}
