import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminDashboardStats = async () => {
  await requireAdmin();
  const [totallSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),
      prisma.course.count(),
      prisma.lesson.count(),
    ]);
  return {
    totallSignups,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
};
