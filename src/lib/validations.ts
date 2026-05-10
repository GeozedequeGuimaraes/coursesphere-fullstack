import { z } from "zod";

const requiredText = (field: string) =>
  z.string().trim().min(1, `${field} é obrigatório`);

export const registerSchema = z.object({
  name: requiredText("Nome"),
  email: z.email("Informe um email válido").toLowerCase(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email("Informe um email válido").toLowerCase(),
  password: requiredText("Senha"),
});

export const courseSchema = z
  .object({
    name: z.string().trim().min(3, "O curso precisa ter pelo menos 3 caracteres"),
    description: z.string().trim().optional().or(z.literal("")),
    startDate: requiredText("Data inicial"),
    endDate: requiredText("Data final"),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "A data final deve ser igual ou posterior à data inicial",
      path: ["endDate"],
    },
  );

export const lessonSchema = z.object({
  title: z.string().trim().min(3, "A aula precisa ter pelo menos 3 caracteres"),
  status: z.enum(["draft", "published"]),
  videoUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: "Informe uma URL válida",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
