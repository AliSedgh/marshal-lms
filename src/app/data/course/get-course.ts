import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export const getIndividualCourse = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      level: true,
      price: true,
      category: true,
      duration: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }
  return course;
};
