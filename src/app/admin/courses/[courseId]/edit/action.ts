"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { headers } from "next/headers";
const editCourse = async (
  courseId: string,
  data: CourseSchemaType,
): Promise<ApiResponse<null>> => {
  const user = await requireAdmin();

  try {
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
