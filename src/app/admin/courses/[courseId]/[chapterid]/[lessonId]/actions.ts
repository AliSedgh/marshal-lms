"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import arcjet from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { fixedWindow } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export const updateLesson = async (
  data: LessonSchemaType,
  lessonId: string,
): Promise<ApiResponse<null>> => {
  const user = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprints: user.user.id!,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { status: "error", message: "Rate limit exceeded" };
      }
      if (decision.reason.isBot()) {
        return { status: "error", message: "Bot detected" };
      }
      return {
        status: "error",
        message: "You are not authorized to edit this course",
      };
    }
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
