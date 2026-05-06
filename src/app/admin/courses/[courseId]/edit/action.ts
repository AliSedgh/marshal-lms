"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );
const editCourse = async (
  courseId: string,
  data: CourseSchemaType,
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
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }
    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: {
        ...validation.data,
      },
    });
    return { status: "success", message: "Course updated successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to update course" };
  }
};

export default editCourse;

export const reorderLessons = async (
  lessons: { id: string; position: number }[],
  chapterId: string,
  courseId: string,
) => {
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
    }
    if (!lessons || lessons.length === 0) {
      return { status: "error", message: "Lessons are required" };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId: chapterId },
        data: {
          position: lesson.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lesson position updated successfully",
    };
  } catch (error) {
    return { status: "error", message: "Failed to update lesson position" };
  }
};

export const reorderChapters = async (
  courseId: string,
  chapters: { id: string; position: number }[],
) => {
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
    }
    if (!chapters || chapters.length === 0) {
      return { status: "error", message: "Chapters are required" };
    }
    const updates = chapters.map((course) =>
      prisma.chapter.update({
        where: { id: course.id, courseId },
        data: {
          position: course.position,
        },
      }),
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters position updated successfully",
    };
  } catch (error) {
    return { status: "error", message: "Failed to update chapters position" };
  }
};
