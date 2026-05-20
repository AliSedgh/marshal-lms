import type { CourseCommentWithVotes } from "@/app/data/course/get-course-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC } from "react";
import { CommentVoteButtons } from "./CommentVoteButtons";

const formatCommentDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);



  

const initialLetter = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
};

interface CommentItemProps {
  comment: CourseCommentWithVotes;
  isLast: boolean;
}

export const CommentItem: FC<CommentItemProps> = ({ comment, isLast }) => {
  const { user } = comment;

  return (
    <div className="flex gap-4">
      <div className="flex w-10 shrink-0 flex-col items-center self-stretch">
        <Avatar className="size-10 shrink-0">
          {user.image?.trim() ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : null}
          <AvatarFallback>
            {initialLetter(user.name || user.email || "")}
          </AvatarFallback>
        </Avatar>
        {!isLast ? (
          <div
            className="mx-auto mt-2 w-0 min-h-0 flex-1 border-l border-dashed border-border"
            aria-hidden
          />
        ) : null}
      </div>
      <div
        className={
          isLast
            ? "min-w-0 flex-1 space-y-1"
            : "min-w-0 flex-1 space-y-1 pb-6"
        }
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate font-medium leading-none">
            {user.name}
          </span>
          <time
            className="shrink-0 text-right text-xs text-muted-foreground tabular-nums whitespace-nowrap"
            dateTime={comment.createdAt.toISOString()}
          >
            {formatCommentDate(comment.createdAt)}
          </time>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {comment.content}
        </p>
        <CommentVoteButtons
          commentId={comment.id}
          likeCount={comment.likeCount}
          dislikeCount={comment.dislikeCount}
          currentUserVote={comment.currentUserVote}
          canVote={comment.canVote}
        />
      </div>
    </div>
  );
};
