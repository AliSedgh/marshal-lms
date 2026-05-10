"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const changeRole = async () => {
  const user = await requireUser();
  const role = user.role;
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: role === "admin" ? "user" : "admin",
      },
    });
    revalidatePath("/");
    return {
      status: "success",
      message: `role changed to ${role === "admin" ? "user" : "admin"} successfully`,
    };
  } catch (error) {
    return { status: "error", message: `failed to change role` };
  }
};
