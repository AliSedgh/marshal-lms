import prisma from "@/lib/db";
import "server-only";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";
export const adminGetCourse = async (courseId: string) => {
  await requireAdmin();
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      price: true,
      fileKey: true,
      duration: true,
      level: true,
      status: true,
      smallDescription: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!course) {
    return notFound();
  }
  return course;
};

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
