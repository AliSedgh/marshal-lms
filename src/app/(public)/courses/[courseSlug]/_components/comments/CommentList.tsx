import { getCourseCommentsWithVotes } from "@/app/data/course/get-course-comments";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  courseId: string;
}

export async function CommentList({ courseId }: CommentListProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const comments = await getCourseCommentsWithVotes(
    courseId,
    session?.user?.id ?? null,
  );

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-0">
      {comments.map((comment, index) => (
        <li key={comment.id}>
          <CommentItem
            comment={comment}
            isLast={index === comments.length - 1}
          />
        </li>
      ))}
    </ul>
  );
}
