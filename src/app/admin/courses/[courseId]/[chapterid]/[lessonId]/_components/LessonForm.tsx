"use client";

import { AdminLessonSingularType } from "@/app/data/admin/admin-get-lesson";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { updateLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

interface IProps {
  data: AdminLessonSingularType;
  chapterId: string;
  courseId: string;
}
const LessonForm = ({ data, chapterId, courseId }: IProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LessonSchema>>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      name: data.title ?? "",
      courseId: courseId,
      chapterId: chapterId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ? data.videoKey : undefined,
    },
  });
  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const result = await tryCatch(updateLesson(values, data.id));
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      if (result.data?.status === "success") {
        toast.success(result.data.message);
      }
    });
  };
  return (
    <div>
      <Button variant="outline" asChild>
        <Link href={`/admin/courses/${courseId}/${chapterId}`}>
          <ArrowLeftIcon className="size-4" />
          <span>Go back</span>
        </Link>
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the lesson details and media.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-description">
                      Lesson Description
                    </FieldLabel>
                    <RichTextEditor field={field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="thumbnailKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-thumbnail">
                      Thumbnail image
                    </FieldLabel>
                    <Uploader
                      fileTypeAccepted="image"
                      onChange={field.onChange}
                      value={field.value}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="videoKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-video">
                      Video file
                    </FieldLabel>
                    <Uploader
                      fileTypeAccepted="video"
                      onChange={field.onChange}
                      value={field.value}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
