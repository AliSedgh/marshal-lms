"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  ChapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  LessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { request } from "@arcjet/next";
import { revalidatePath, revalidateTag } from "next/cache";
const aj = arcjet.withRule(
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

export const createChapter = async (data: ChapterSchemaType) => {
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
    const validation = ChapterSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: { courseId: data.courseId },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.chapter.create({
        data: {
          title: validation.data.name,
          courseId: validation.data.courseId,
          position: maxPos?.position ? maxPos.position + 1 : 1,
        },
      });
      revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);
      return {
        status: "success",
        message: "Chapters position updated successfully",
      };
    });
    return { status: "success", message: "Chapter created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create chapter" };
  }
};

export const createLesson = async (data: LessonSchemaType) => {
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
    const validation = LessonSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: { chapterId: data.chapterId },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });
      await tx.lesson.create({
        data: {
          title: validation.data.name,
          description: validation.data.description,
          videoKey: validation.data.videoKey || "",
          thumbnailKey: validation.data.thumbnailKey,
          chapterId: validation.data.chapterId,
          position: maxPos?.position ? maxPos.position + 1 : 1,
        },
      });
      revalidatePath(`/admin/courses/${validation.data.courseId}/edit`);
      return {
        status: "success",
        message: "Lesson created successfully",
      };
    });
    return { status: "success", message: "Lesson created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create lesson" };
  }
};

export const deleteLesson = async (
  lessonId: string,
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
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });
    if (!chapterWithLessons) {
      return { status: "error", message: "Chapter not found in the chapter" };
    }

    const lessons = chapterWithLessons.lessons;
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found" };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          position: index + 1,
        },
      });
    });
    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    return { status: "error", message: "Failed to delete lesson" };
  }
};

export const deleteChapter = async (chapterId: string, courseId: string) => {
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
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });
    if (!courseWithChapters) {
      return { status: "error", message: "Chapter not found in the chapter" };
    }

    const chapters = courseWithChapters.chapter;
    const ChapterToDelete = chapters.find((chap) => chap.id === chapterId);
    if (!ChapterToDelete) {
      return { status: "error", message: "Chapter not found" };
    }

    const remainChapters = chapters.filter((chap) => chap.id !== chapterId);

    const updates = remainChapters.map((chap, index) => {
      return prisma.chapter.update({
        where: { id: chap.id },
        data: {
          position: index + 1,
        },
      });
    });
    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
          courseId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    return { status: "error", message: "Failed to delete chapter" };
  }
};
