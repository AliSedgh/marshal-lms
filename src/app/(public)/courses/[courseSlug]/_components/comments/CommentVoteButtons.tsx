"use client";

import { setCommentVote } from "../../actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { toast } from "sonner";

export type CommentVoteTypeUi = "Like" | "Dislike" | null;

interface CommentVoteButtonsProps {
  commentId: string;
  likeCount: number;
  dislikeCount: number;
  currentUserVote: CommentVoteTypeUi;
  canVote: boolean;
}

export const CommentVoteButtons: FC<CommentVoteButtonsProps> = ({
  commentId,
  likeCount,
  dislikeCount,
  currentUserVote,
  canVote,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handle = (intent: "like" | "dislike") => {
    if (!canVote) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      const result = await setCommentVote(commentId, intent);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        title={canVote ? "Like" : "Log in to vote"}
        className={cn(
          "h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
          currentUserVote === "Like" &&
            "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
        )}
        onClick={() => handle("like")}
      >
        <ThumbsUp className="size-4" aria-hidden />
        <span className="min-w-[1ch] text-xs font-medium tabular-nums">
          {likeCount}
        </span>
        <span className="sr-only">likes</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        title={canVote ? "Dislike" : "Log in to vote"}
        className={cn(
          "h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
          currentUserVote === "Dislike" &&
            "bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
        )}
        onClick={() => handle("dislike")}
      >
        <ThumbsDown className="size-4" aria-hidden />
        <span className="min-w-[1ch] text-xs font-medium tabular-nums">
          {dislikeCount}
        </span>
        <span className="sr-only">dislikes</span>
      </Button>
    </div>
  );
};
