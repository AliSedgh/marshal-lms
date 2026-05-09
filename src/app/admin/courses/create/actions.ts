"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { stripe } from "@/lib/stripe";

export const createCourse = async (
  data: CourseSchemaType,
): Promise<ApiResponse<null>> => {
  const session = await requireAdmin();

  try {
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }

    const dataStripe = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user?.id!,
        stripePriceId: dataStripe.default_price as string,
      },
    });

    return { status: "success", message: "Course created successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to create course" };
  }
};

export const createChapter = async () => {
  await prisma.lesson.create({
    data: {
      position: 2,
      title: "lesson 2",
      chapterId: "90712f91-2c48-464d-be0c-ea4687f28e02",
      videoKey: "test.mp4",
    },
  });
};
