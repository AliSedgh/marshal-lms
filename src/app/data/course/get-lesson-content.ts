import "server-only";
import prisma from "@/lib/db";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export const getLessonContent = async (lessonId: string) => {
  const user = await requireUser();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: user.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      chapter: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
  if (!lesson) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        userId: user.id,
        courseId: lesson.chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });
  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return lesson;
};

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
