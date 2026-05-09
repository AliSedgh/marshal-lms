"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const markLessonAsCompleted = async (lessonId: string, slug: string) => {
  const session = await requireUser();
  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        lessonId,
        userId: session.id,
        completed: true,
      },
    });
    revalidatePath(`/dashboard/${slug}/${lessonId}`);
    return { status: "success", message: "Lesson marked as completed" };
  } catch (error) {
    console.log("eeeeeeeeeee", error);

    return { status: "error", message: "Failed to mark lesson as completed" };
  }
};
