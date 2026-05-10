import type { Course, Lesson } from "@prisma/client";

export function serializeCourse(course: Course & { lessons?: Lesson[] }) {
  return {
    ...course,
    startDate: course.startDate.toISOString().slice(0, 10),
    endDate: course.endDate.toISOString().slice(0, 10),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    lessons: course.lessons?.map(serializeLesson),
  };
}

export function serializeLesson(lesson: Lesson) {
  return {
    ...lesson,
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString(),
  };
}
