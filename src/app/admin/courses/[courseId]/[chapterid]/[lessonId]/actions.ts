"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";

export const updateLesson = async (
  data: LessonSchemaType,
  lessonId: string,
): Promise<ApiResponse<null>> => {
  await requireAdmin();
  try {
    const result = LessonSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      },
    });

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "An error occurred while updating the lesson",
      data: null,
    };
  }
};
