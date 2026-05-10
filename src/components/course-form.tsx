"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { courseSchema, type CourseInput } from "@/lib/validations";
import type { Curso } from "@/types";

type CourseFormProps = {
  course?: Curso;
  isSubmitting?: boolean;
  onSubmit: (data: CourseInput) => void;
};

export function CourseForm({ course, isSubmitting, onSubmit }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name ?? "",
      description: course?.description ?? "",
      startDate: course?.startDate ?? "",
      endDate: course?.endDate ?? "",
    },
  });

  return (
    <form className="grid gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Field label="Nome do curso" error={errors.name?.message}>
        <Input placeholder="Ex.: React para iniciantes" {...register("name")} />
      </Field>
      <Field label="Descrição" error={errors.description?.message}>
        <Textarea placeholder="Resumo do conteúdo do curso" {...register("description")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data inicial" error={errors.startDate?.message}>
          <Input type="date" {...register("startDate")} />
        </Field>
        <Field label="Data final" error={errors.endDate?.message}>
          <Input type="date" {...register("endDate")} />
        </Field>
      </div>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Salvando..." : "Salvar curso"}
      </Button>
    </form>
  );
}
