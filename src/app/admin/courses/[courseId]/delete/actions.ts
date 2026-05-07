"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const deleteCourse = async (
  courseId: string,
): Promise<ApiResponse<null>> => {
  console.log("courseId", courseId);
  await requireAdmin();
  try {
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
