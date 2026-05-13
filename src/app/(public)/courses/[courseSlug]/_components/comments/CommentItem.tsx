import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC } from "react";
import {
  CommentVoteButtons,
  type CommentVoteTypeUi,
} from "./CommentVoteButtons";

export type CommentItemData = {
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
  currentUserVote: CommentVoteTypeUi;
  canVote: boolean;
};

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
  comment: CommentItemData;
}

export const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const { user } = comment;

  return (
    <div className="flex gap-4">
      <Avatar className="size-10 shrink-0">
        {user.image?.trim() ? (
          <AvatarImage src={user.image} alt={user.name} />
        ) : null}
        <AvatarFallback>
          {initialLetter(user.name || user.email || "")}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-medium leading-none">{user.name}</span>
          <time
            className="text-xs text-muted-foreground"
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
