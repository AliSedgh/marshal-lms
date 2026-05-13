"use client";

import { createComment } from "../../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { toast } from "sonner";

interface CommentFormProps {
  courseId: string;
  isAuthenticated: boolean;
}

export const CommentForm: FC<CommentFormProps> = ({
  courseId,
  isAuthenticated,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>{" "}
        to comment.
      </p>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const raw = String(fd.get("content") ?? "");
        startTransition(async () => {
          const result = await createComment(courseId, raw);
          if (result.ok) {
            form.reset();
            toast.success("Comment posted.");
            router.refresh();
          } else {
            toast.error(result.message);
          }
        });
      }}
    >
      <label htmlFor="course-comment" className="sr-only">
        Your comment
      </label>
      <Textarea
        id="course-comment"
        name="content"
        required
        minLength={1}
        maxLength={5000}
        rows={4}
        placeholder="Write a comment…"
        disabled={isPending}
        className="min-h-24 resize-y"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit"}
        </Button>
      </div>
    </form>
  );
};
