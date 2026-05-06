"use client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseLevels,
  coursesCategories,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchema";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlugIcon, SaveIcon, SparkleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import editCourse from "../action";
import { CourseStatus } from "@/app/generated/prisma/client";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import slugify from "slugify";

type Props = {
  course: AdminCourseSingularType;
  courseId: string;
};

const EditCourseForm = ({ course, courseId }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
      fileKey: course.fileKey,
      level: course.level,
      status: course.status as CourseStatus,
      category: course.category as CourseSchemaType["category"],
      smallDescription: course.smallDescription,
      slug: course.slug,
      duration: course.duration,
    },
  });
  const onSubmit = (data: CourseSchemaType) => {
    startTransition(async () => {
      const result = await tryCatch(editCourse(courseId, data));
      if (result.error) {
        toast.error("An error occurred while creating the course");
        return;
      }
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result?.data?.status === "error") {
        toast.error(result?.data?.message);
      }
    });
  };
  const generateSlug = () => {
    const titleValue = form.getValues("title");
    const slug = slugify(titleValue);
    form.setValue("slug", slug, { shouldValidate: true });
  };

  return (
    <form
      id="form-rhf-demo"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">
                Course Title
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter course title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex gap-4 items-end">
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-slug"
                  aria-invalid={fieldState.invalid}
                  placeholder=" Slug"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button onClick={generateSlug} type="button">
            <SparkleIcon className="ml-1" size={16} />
            Generate Slug
          </Button>
        </div>
        <Controller
          name="smallDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-small-description">
                Small Description
              </FieldLabel>
              <Textarea
                {...field}
                id="form-rhf-demo-small-description"
                aria-invalid={fieldState.invalid}
                placeholder="small description"
                autoComplete="off"
                className="min-h-[120px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-small-description">
                Description
              </FieldLabel>
              <RichTextEditor field={field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fileKey"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-small-description">
                Thumbnail image
              </FieldLabel>
              <Uploader
                fileTypeAccepted="image"
                value={field.value}
                onChange={(value) => form.setValue("fileKey", value)}
              />
            </Field>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-category">
                  Category
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder=" Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-level">Level</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder=" Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseLevels.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="duration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-small-description">
                  Duration
                </FieldLabel>

                <Input
                  placeholder="Duration in hours"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value)); // تبدیل به number
                  }}
                  type="number"
                  id="form-rhf-demo-duration"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-price">Price ($)</FieldLabel>
                <Input
                  placeholder="price"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value)); // تبدیل به number
                  }}
                  type="number"
                  id="form-rhf-demo-price"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-level">Level</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder=" Select level" />
                </SelectTrigger>
                <SelectContent>
                  {courseStatus.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button disabled={isPending} type="submit">
        {isPending ? (
          <>
            Updating...
            <Loader2 className="ml-1" size={16} />
          </>
        ) : (
          <>
            Update Course <SaveIcon className="ml-1" size={16} />
          </>
        )}
      </Button>
    </form>
  );
};

export default EditCourseForm;
