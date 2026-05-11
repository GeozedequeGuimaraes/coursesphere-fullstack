"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CourseForm } from "@/components/course-form";
import { LessonForm } from "@/components/lesson-form";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/http";
import type { CourseInput, LessonInput } from "@/lib/validations";
import type { Aula, Curso } from "@/types";

type Instructor = {
  name: string;
  email: string;
  photo: string | null;
};

export default function CursoDetalhePage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingCourse, setEditingCourse] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Aula | undefined>();
  const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Aula | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [message, setMessage] = useState("");

  const courseQuery = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => api<{ course: Curso }>(`/api/courses/${params.courseId}`),
  });

  const instructorQuery = useQuery({
    queryKey: ["instructor", params.courseId],
    queryFn: () => api<{ instructor: Instructor }>("/api/external/instructor"),
  });

  const course = courseQuery.data?.course;

  const updateCourse = useMutation({
    mutationFn: (data: CourseInput) =>
      api<{ course: Curso }>(`/api/courses/${params.courseId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onMutate: () => setMessage(""),
    onSuccess: () => {
      setMessage("");
      setEditingCourse(false);
      queryClient.invalidateQueries({ queryKey: ["course", params.courseId] });
    },
    onError: (error) => setMessage(error instanceof ApiError ? error.message : "Erro ao salvar."),
  });

  const createLesson = useMutation({
    mutationFn: (data: LessonInput) =>
      api<{ lesson: Aula }>(`/api/courses/${params.courseId}/lessons`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          course: course
            ? {
                name: course.name,
                description: course.description ?? "",
                startDate: course.startDate,
                endDate: course.endDate,
              }
            : undefined,
        }),
      }),
    onMutate: () => setMessage(""),
    onSuccess: (response) => {
      setMessage("");
      queryClient.setQueryData<{ course: Curso }>(["course", params.courseId], (current) =>
        current
          ? {
              course: {
                ...current.course,
                lessons: [...(current.course.lessons ?? []), response.lesson],
              },
            }
          : current,
      );
    },
    onError: (error) => setMessage(error instanceof ApiError ? error.message : "Erro ao salvar a aula."),
  });

  const updateLesson = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LessonInput }) =>
      api<{ lesson: Aula }>(`/api/lessons/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onMutate: () => setMessage(""),
    onSuccess: () => {
      setMessage("");
      setEditingLesson(undefined);
      queryClient.invalidateQueries({ queryKey: ["course", params.courseId] });
    },
    onError: (error) => setMessage(error instanceof ApiError ? error.message : "Erro ao salvar a aula."),
  });

  const deleteLesson = useMutation({
    mutationFn: (lessonId: string) =>
      api(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      }),
    onMutate: () => setMessage(""),
    onSuccess: () => {
      setMessage("");
      setLessonToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["course", params.courseId] });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: () => api(`/api/courses/${params.courseId}`, { method: "DELETE" }),
    onMutate: () => setMessage(""),
    onSuccess: () => router.push("/dashboard"),
  });

  const lessons = course?.lessons?.filter((lesson) =>
    statusFilter === "all" ? true : lesson.status === statusFilter,
  );

  if (courseQuery.isLoading) {
    return <p className="text-sm text-slate-600">Carregando curso...</p>;
  }

  if (!course) {
    return <p className="text-sm text-red-600">Curso não encontrado.</p>;
  }

  return (
    <main className="grid gap-6">
      <Link className="text-sm font-medium text-emerald-800 underline" href="/dashboard">
        Voltar para cursos
      </Link>

      <section className="relative overflow-hidden rounded-xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
          height={1200}
          src="/images/classroom.jpg"
          width={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/72" />
        <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Detalhes do curso
            </span>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-[#10201c]">
              {course.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {course.description || "Curso sem descrição."}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {course.startDate} até {course.endDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditingCourse((value) => !value)}>
              <Pencil size={16} />
              Editar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleteCourseDialogOpen(true)}
              disabled={deleteCourse.isPending}
            >
              <Trash2 size={16} />
              Excluir
            </Button>
          </div>
        </div>

        {message ? <p className="relative mt-4 text-sm text-red-600">{message}</p> : null}

        {editingCourse ? (
          <div className="relative mt-6 border-t border-emerald-100 pt-6">
            <CourseForm course={course} isSubmitting={updateCourse.isPending} onSubmit={updateCourse.mutate} />
          </div>
        ) : null}
      </section>

      <section className="border-y border-emerald-100 py-6">
        <h2 className="text-2xl font-semibold text-[#10201c]">Instrutor convidado</h2>
        {instructorQuery.isLoading ? (
          <p className="mt-3 text-sm text-slate-600">Buscando sugestão...</p>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            {instructorQuery.data?.instructor.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={instructorQuery.data.instructor.name}
                className="h-12 w-12 rounded-full object-cover"
                src={instructorQuery.data.instructor.photo}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-200" />
            )}
            <div>
              <p className="font-medium text-slate-950">{instructorQuery.data?.instructor.name}</p>
              <p className="text-sm text-slate-600">{instructorQuery.data?.instructor.email}</p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-4 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-semibold text-[#10201c]">Aulas</h2>
          <select
            className="h-10 rounded-md border border-emerald-100 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            <option value="all">Todas</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicadas</option>
          </select>
        </div>

        <div className="grid gap-3">
          {lessons?.map((lesson) => (
            <article key={lesson.id} className="rounded-xl border border-emerald-100 bg-[#fbfdfb] p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h3 className="font-medium text-slate-950">{lesson.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {lesson.status === "published" ? "Publicada" : "Rascunho"}
                    {lesson.videoUrl ? ` | ${lesson.videoUrl}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setEditingLesson(lesson)}>
                    Editar
                  </Button>
                  <Button type="button" variant="danger" onClick={() => setLessonToDelete(lesson)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {lessons?.length === 0 ? <p className="text-sm text-slate-600">Nenhuma aula encontrada.</p> : null}

        <div className="border-t border-slate-200 pt-5">
          <h3 className="mb-4 inline-flex items-center gap-2 font-semibold text-slate-950">
            <Plus size={17} />
            {editingLesson ? "Editar aula" : "Nova aula"}
          </h3>
          <LessonForm
            key={editingLesson?.id ?? "new"}
            lesson={editingLesson}
            isSubmitting={createLesson.isPending || updateLesson.isPending}
            onSubmit={(data) =>
              editingLesson
                ? updateLesson.mutate({ id: editingLesson.id, data })
                : createLesson.mutate(data)
            }
          />
          {editingLesson ? (
            <Button className="mt-3" type="button" variant="ghost" onClick={() => setEditingLesson(undefined)}>
              Cancelar edição
            </Button>
          ) : null}
        </div>
      </section>

      <ConfirmDialog
        open={deleteCourseDialogOpen}
        title="Excluir curso?"
        description={`Essa ação vai excluir o curso "${course.name}" e todas as aulas vinculadas a ele. Essa ação não pode ser desfeita.`}
        isLoading={deleteCourse.isPending}
        onCancel={() => setDeleteCourseDialogOpen(false)}
        onConfirm={() => deleteCourse.mutate()}
      />

      <ConfirmDialog
        open={Boolean(lessonToDelete)}
        title="Excluir aula?"
        description={`Essa ação vai excluir a aula "${lessonToDelete?.title ?? ""}". Essa ação não pode ser desfeita.`}
        isLoading={deleteLesson.isPending}
        onCancel={() => setLessonToDelete(null)}
        onConfirm={() => lessonToDelete && deleteLesson.mutate(lessonToDelete.id)}
      />
    </main>
  );
}
