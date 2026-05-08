"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export const deleteCourse = async (
  courseId: string,
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

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath("/admin/courses");
    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.log("errrrr", error);

    return {
      status: "error",
      message: "Failed to delete Course!",
    };
  }
};
