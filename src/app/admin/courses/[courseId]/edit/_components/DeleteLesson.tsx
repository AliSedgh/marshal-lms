import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { FC, useState, useTransition } from "react";
import { deleteLesson } from "../action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

interface IProps {
  lessonId: string;
  chapterId: string;
  courseId: string;
}

const DeleteLesson: FC<IProps> = ({ lessonId, chapterId, courseId }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await tryCatch(
        deleteLesson(lessonId, chapterId, courseId),
      );
      if (result.error) {
        toast.error("An error occurred while deleting the lesson");
        return;
      }
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        setOpen(false);
      } else if (result.data.status === "error") {
        toast.error(result.data.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this lesson?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently delete the lesson.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending}>
            {isPending ? <>Deleting...</> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLesson;
