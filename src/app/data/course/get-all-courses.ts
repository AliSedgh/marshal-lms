import prisma from "@/lib/db";

export const getAllCourses = async () => {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published",
    },
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
      category: true,
    },
  });
  return courses;
};

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>;
