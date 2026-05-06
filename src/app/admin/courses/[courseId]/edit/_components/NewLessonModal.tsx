import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import {
  ChapterSchema,
  ChapterSchemaType,
  CourseSchemaType,
  LessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { createChapter, createLesson } from "../action";
import { toast } from "sonner";

interface IProps {
  courseId: string;
  chapterId: string;
}

const NewLessonModal = ({ courseId, chapterId }: IProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      name: "",
      courseId,
      chapterId,
    },
  });
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };

  const handleSubmit = (data: LessonSchemaType) => {
    startTransition(async () => {
      const result = await tryCatch(createLesson(data));
      if (result.error) {
        toast.error("An error occurred while creating the lesson");
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full">
          <Plus className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your lesson
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Lesson Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter lesson title"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="size-4" />
                  Saving...
                </>
              ) : (
                <>Save Change</>
              )}{" "}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLessonModal;
