import "server-only";
import prisma from "@/lib/db";
import { requireUser } from "./require-user";

export const getEnrolledCourses = async () => {
  const user = await requireUser();
  const courses = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          duration: true,
          smallDescription: true,
          slug: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          fileKey: true,
          category: true,
          level: true,
          chapter: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  thumbnailKey: true,
                  videoKey: true,
                  position: true,
                  createdAt: true,
                  updatedAt: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return courses;
};

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[number];
