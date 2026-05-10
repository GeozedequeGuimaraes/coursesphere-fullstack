"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { lessonSchema, type LessonInput } from "@/lib/validations";
import type { Aula } from "@/types";

type LessonFormProps = {
  lesson?: Aula;
  isSubmitting?: boolean;
  onSubmit: (data: LessonInput) => void;
};

export function LessonForm({ lesson, isSubmitting, onSubmit }: LessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title ?? "",
      status: lesson?.status ?? "draft",
      videoUrl: lesson?.videoUrl ?? "",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Título da aula" error={errors.title?.message}>
        <Input placeholder="Ex.: Introdução ao projeto" {...register("title")} />
      </Field>
      <Field label="Status" error={errors.status?.message}>
        <select
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
          {...register("status")}
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicada</option>
        </select>
      </Field>
      <Field label="URL do video" error={errors.videoUrl?.message}>
        <Input placeholder="https://..." {...register("videoUrl")} />
      </Field>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Salvando..." : "Salvar aula"}
      </Button>
    </form>
  );
}
