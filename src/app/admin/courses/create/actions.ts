"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
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
export const createCourse = async (
  data: CourseSchemaType,
): Promise<ApiResponse<null>> => {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprints: session?.user?.id!,
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
        message: "You are not authorized to create courses",
      };
    }
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user?.id!,
      },
    });

    return { status: "success", message: "Course created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create course" };
  }
};

export const createLesson = async () => {
  await prisma.lesson.create({
    data: {
      position: 1,
      title: "lesson 1 chapter 1",
      chapterId: "90712f91-2c48-464d-be0c-ea4687f28e02",
      videoKey: "",
    },
  });
};
