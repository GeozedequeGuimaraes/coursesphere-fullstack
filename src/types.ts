export type Usuario = {
  id: string;
  name: string;
  email: string;
};

export type Aula = {
  id: string;
  title: string;
  status: "draft" | "published";
  videoUrl: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type Curso = {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  lessons?: Aula[];
};
