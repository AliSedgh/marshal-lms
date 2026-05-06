import "server-only";
import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";
export const adminGetLesson = async (lessonId: string) => {
  await requireAdmin();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      position: true,
      videoKey: true,
    },
  });

  if (!lesson) {
    return notFound();
  }
  return lesson;
};

export type AdminLessonSingularType = Awaited<
  ReturnType<typeof adminGetLesson>
>;
