"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/http";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { useAuthStore } from "@/store/auth-store";
import type { Usuario } from "@/types";

export default function CadastroPage() {
  const router = useRouter();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: RegisterInput) {
    setMessage("");

    try {
      const response = await api<{ user: Usuario }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUsuario(response.user);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Não foi possível criar a conta.");
    }
  }

  return (
    <section className="w-full max-w-md border-y border-[#cbe9d9] py-8">
      <Link className="mb-6 inline-flex items-center gap-2 font-semibold text-[#10201c] lg:hidden" href="/">
        CourseSphere
      </Link>
      <p className="text-sm font-semibold text-[#247758]">
        Primeiro acesso
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#10201c]">
        Criar conta
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Abra seu espaço de trabalho para cadastrar cursos, datas e primeiras aulas.
      </p>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Nome" error={errors.name?.message}>
          <Input placeholder="Seu nome" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="seu@email.com" {...register("email")} />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" placeholder="Mínimo de 6 caracteres" {...register("password")} />
        </Field>
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Criando..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Já tem conta?{" "}
        <Link className="font-medium text-emerald-800 underline" href="/login">
          Entrar
        </Link>
      </p>
    </section>
  );
}
