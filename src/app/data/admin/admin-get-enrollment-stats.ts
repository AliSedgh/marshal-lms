import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetEnrollmentStats = async () => {
  await requireAdmin();
  const thirtyDayAgo = new Date();
  thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);
  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDayAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30Day: { date: string; enrollments: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last30Day.push({ date: date.toISOString().split("T")[0], enrollments: 0 });
  }
  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const index = last30Day.findIndex((day) => day.date === enrollmentDate);
    if (index !== -1) {
      last30Day[index].enrollments++;
    }
  });
  return last30Day;
};
