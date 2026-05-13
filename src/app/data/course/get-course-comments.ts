import "server-only";

import prisma from "@/lib/db";

export type CommentVoteChoice = "Like" | "Dislike" | null;

export type CourseCommentWithVotes = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
    email: string | null;
  };
  likeCount: number;
  dislikeCount: number;
  currentUserVote: CommentVoteChoice;
  canVote: boolean;
};

export async function getCourseCommentsWithVotes(
  courseId: string,
  currentUserId: string | null,
): Promise<CourseCommentWithVotes[]> {
  const canVote = Boolean(currentUserId);

  const comments = await prisma.comment.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  const commentIds = comments.map((c) => c.id);

  const countsByComment = new Map<
    string,
    { likes: number; dislikes: number }
  >();
  const myVoteByComment = new Map<string, "Like" | "Dislike">();

  if (commentIds.length > 0) {
    const [grouped, myVotes] = await Promise.all([
      prisma.commentVote.groupBy({
        by: ["commentId", "type"],
        where: { commentId: { in: commentIds } },
        _count: { _all: true },
      }),
      currentUserId
        ? prisma.commentVote.findMany({
            where: {
              userId: currentUserId,
              commentId: { in: commentIds },
            },
            select: { commentId: true, type: true },
          })
        : Promise.resolve([]),
    ]);

    for (const id of commentIds) {
      countsByComment.set(id, { likes: 0, dislikes: 0 });
    }
    for (const row of grouped) {
      const cur = countsByComment.get(row.commentId)!;
      if (row.type === "Like") {
        cur.likes = row._count._all;
      } else {
        cur.dislikes = row._count._all;
      }
    }
    for (const v of myVotes) {
      myVoteByComment.set(v.commentId, v.type);
    }
  }

  return comments.map((c) => {
    const counts = countsByComment.get(c.id) ?? { likes: 0, dislikes: 0 };
    const mine = myVoteByComment.get(c.id);
    const currentUserVote: CommentVoteChoice = mine ?? null;
    return {
      ...c,
      likeCount: counts.likes,
      dislikeCount: counts.dislikes,
      currentUserVote,
      canVote,
    };
  });
}
