"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CourseForm } from "@/components/course-form";
import { ApiError, api } from "@/lib/http";
import type { CourseInput } from "@/lib/validations";
import type { Curso } from "@/types";

export default function NovoCursoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const createCourse = useMutation({
    mutationFn: (data: CourseInput) =>
      api<{ course: Curso }>("/api/courses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.setQueryData(["course", response.course.id], { course: response.course });
      router.push(`/dashboard/cursos/${response.course.id}`);
    },
    onError: (error) => {
      setMessage(error instanceof ApiError ? error.message : "Não foi possível salvar o curso.");
    },
  });

  return (
    <main className="max-w-5xl">
      <Link className="text-sm font-medium text-emerald-800 underline" href="/dashboard">
        Voltar para cursos
      </Link>
      <section className="mt-5 grid gap-8 border-y border-[#cbe9d9] py-6 lg:grid-cols-[0.85fr_1fr]">
        <div className="relative hidden min-h-[520px] overflow-hidden rounded-xl lg:block">
          <Image
            alt="Biblioteca com mesa de estudos"
            className="h-full w-full object-cover"
            height={1200}
            src="/images/library-study.jpg"
            width={900}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#082f24]/90 via-[#0f3e31]/28 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm font-semibold text-emerald-100">
              Estrutura do curso
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Comece pelo essencial.</h1>
            <p className="mt-3 text-sm leading-6 text-white/85">
              Defina nome, período e descrição. Depois, você organiza as aulas dentro do curso.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 lg:p-8">
          <p className="text-sm font-semibold text-emerald-700">
            Novo curso
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-none text-[#10201c]">
            Dê uma casa para esse conteúdo.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Nome, período e uma descrição curta já bastam para começar. As aulas entram depois.
          </p>
          {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
          <div className="mt-6">
            <CourseForm isSubmitting={createCourse.isPending} onSubmit={createCourse.mutate} />
          </div>
        </div>
      </section>
    </main>
  );
}
