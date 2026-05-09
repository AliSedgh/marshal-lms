import "server-only";
import { requireUser } from "../user/require-user";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
export const getCourseSidebar = async (slug: string) => {
  const user = await requireUser();
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      level: true,
      duration: true,
      price: true,
      category: true,
      slug: true,
      chapter: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: user.id,
      },
    },
  });
  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }
  return course;
};

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebar>
>;
