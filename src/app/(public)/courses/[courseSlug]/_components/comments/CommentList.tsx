import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CommentItem } from "./CommentItem";
import type { CommentVoteTypeUi } from "./CommentVoteButtons";

interface CommentListProps {
  courseId: string;
}

export async function CommentList({ courseId }: CommentListProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id ?? null;
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

  const commentsWithVotes = comments.map((c) => {
    const counts = countsByComment.get(c.id) ?? { likes: 0, dislikes: 0 };
    const mine = myVoteByComment.get(c.id);
    const currentUserVote: CommentVoteTypeUi = mine ?? null;
    return {
      ...c,
      likeCount: counts.likes,
      dislikeCount: counts.dislikes,
      currentUserVote,
      canVote,
    };
  });

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-0">
      {commentsWithVotes.map((comment, index) => (
        <li
          key={comment.id}
          className={
            index < commentsWithVotes.length - 1
              ? "border-b border-dashed border-border pb-6 mb-6"
              : undefined
          }
        >
          <CommentItem comment={comment} />
        </li>
      ))}
    </ul>
  );
}
