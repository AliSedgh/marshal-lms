"use server";

import { requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const MAX_LENGTH = 5000;

export type CreateCommentResult =
  | { ok: true }
  | { ok: false; message: string };

export async function createComment(
  courseId: string,
  content: string,
): Promise<CreateCommentResult> {
  const user = await requireUser();

  const trimmed = content.trim();
  if (!trimmed) {
    return { ok: false, message: "Comment cannot be empty." };
  }
  if (trimmed.length > MAX_LENGTH) {
    return {
      ok: false,
      message: `Comment must be at most ${MAX_LENGTH} characters.`,
    };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { slug: true },
  });
  if (!course) {
    return { ok: false, message: "Course not found." };
  }

  await prisma.comment.create({
    data: {
      courseId,
      userId: user.id,
      content: trimmed,
    },
  });

  revalidatePath(`/courses/${course.slug}`);
  return { ok: true };
}

export type SetCommentVoteResult =
  | { ok: true }
  | { ok: false; message: string };

export async function setCommentVote(
  commentId: string,
  intent: "like" | "dislike",
): Promise<SetCommentVoteResult> {
  const user = await requireUser();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      course: { select: { slug: true } },
    },
  });
  if (!comment) {
    return { ok: false, message: "Comment not found." };
  }

  const voteType = intent === "like" ? "Like" : "Dislike";

  const existing = await prisma.commentVote.findUnique({
    where: {
      commentId_userId: { commentId, userId: user.id },
    },
  });

  if (existing?.type === voteType) {
    await prisma.commentVote.delete({
      where: { commentId_userId: { commentId, userId: user.id } },
    });
  } else if (existing) {
    await prisma.commentVote.update({
      where: { commentId_userId: { commentId, userId: user.id } },
      data: { type: voteType },
    });
  } else {
    await prisma.commentVote.create({
      data: {
        commentId,
        userId: user.id,
        type: voteType,
      },
    });
  }

  revalidatePath(`/courses/${comment.course.slug}`);
  return { ok: true };
}
