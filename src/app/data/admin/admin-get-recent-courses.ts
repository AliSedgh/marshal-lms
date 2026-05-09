import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetRecentCourses = async () => {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
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
  return data;
};
