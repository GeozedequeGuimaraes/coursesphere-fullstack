"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BookOpen, FilePenLine, Layers3, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/http";
import type { Curso } from "@/types";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<Curso | null>(null);
  const queryClient = useQueryClient();
  const coursesQuery = useQuery({
    queryKey: ["courses", search],
    queryFn: () => api<{ courses: Curso[] }>(`/api/courses?search=${encodeURIComponent(search)}`),
  });

  const deleteCourse = useMutation({
    mutationFn: (courseId: string) =>
      api(`/api/courses/${courseId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      setCourseToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const courses = coursesQuery.data?.courses ?? [];
  const totalLessons = courses.reduce((total, course) => total + (course.lessons?.length ?? 0), 0);
  const draftLessons = courses.reduce(
    (total, course) =>
      total + (course.lessons?.filter((lesson) => lesson.status === "draft").length ?? 0),
    0,
  );

  return (
    <main className="grid gap-8">
      <section className="relative min-h-[300px] overflow-hidden rounded-xl bg-[#11231e] p-6 text-white shadow-xl shadow-emerald-900/10 md:p-8 lg:min-h-[340px]">
        <Image
          alt="Biblioteca com mesas de estudo, luminárias e estudantes"
          className="absolute inset-0 h-full w-full object-cover object-[64%_72%] opacity-70"
          height={1200}
          priority
          src="/images/dashboard-library-wide.jpg"
          width={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11231e]/95 via-[#11231e]/76 to-[#2b765d]/10" />
        <div className="relative flex min-h-[232px] flex-col justify-between gap-6 lg:min-h-[256px] lg:flex-row lg:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
              Área de trabalho
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              Bem-vindo à sua área de cursos.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/85">
              Acompanhe seus cursos, revise aulas em rascunho e mantenha sua rotina de ensino organizada em um só lugar.
            </p>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            href="/dashboard/cursos/novo"
          >
            <Plus size={17} />
            Novo curso
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/5">
          <Layers3 className="text-emerald-700" size={20} />
          <strong className="mt-4 block text-3xl text-[#10201c]">{courses.length}</strong>
          <span className="text-sm text-slate-600">cursos cadastrados</span>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/5">
          <BookOpen className="text-emerald-700" size={20} />
          <strong className="mt-4 block text-3xl text-[#10201c]">
            {totalLessons}
          </strong>
          <span className="text-sm text-slate-600">aulas organizadas</span>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/5">
          <FilePenLine className="text-emerald-700" size={20} />
          <strong className="mt-4 block text-3xl text-[#10201c]">{draftLessons}</strong>
          <span className="text-sm text-slate-600">aulas em rascunho</span>
        </div>
      </section>

      <section className="flex flex-col justify-between gap-4 pt-1 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Biblioteca
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#10201c]">
            Cursos em andamento
          </h2>
        </div>
        <label className="relative block w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Buscar por nome do curso"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </section>

      {coursesQuery.isLoading ? <p className="text-sm text-slate-600">Carregando cursos...</p> : null}
      {coursesQuery.isError ? <p className="text-sm text-red-600">Não foi possível carregar os cursos.</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="group overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/8"
          >
            <div className="relative h-40">
              <Image
                alt=""
                className="h-full w-full object-cover"
                height={600}
                src="/images/course-card-library-lamp.jpg"
                width={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-emerald-800">
                {course.lessons?.length ?? 0} aulas
              </span>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold leading-tight text-[#10201c]">
                {course.name}
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                {course.startDate} até {course.endDate}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <Link
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-emerald-100 bg-white px-4 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50"
                  href={`/dashboard/cursos/${course.id}`}
                >
                  Abrir
                  <ArrowRight size={15} />
                </Link>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setCourseToDelete(course)}
                  disabled={deleteCourse.isPending}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {coursesQuery.data?.courses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nenhum curso encontrado.
        </p>
      ) : null}

      <ConfirmDialog
        open={Boolean(courseToDelete)}
        title="Excluir curso?"
        description={`Essa ação vai excluir o curso "${courseToDelete?.name ?? ""}" e todas as aulas vinculadas a ele. Essa ação não pode ser desfeita.`}
        isLoading={deleteCourse.isPending}
        onCancel={() => setCourseToDelete(null)}
        onConfirm={() => courseToDelete && deleteCourse.mutate(courseToDelete.id)}
      />
    </main>
  );
}
