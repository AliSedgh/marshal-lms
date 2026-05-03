import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getAdminCourses() {
  await requireAdmin();
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      smallDescription: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      category: true,
    },
  });
  return courses;
}

export type AdminCourseType = Awaited<
  ReturnType<typeof getAdminCourses>
>[number];
