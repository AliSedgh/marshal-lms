"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

const page = () => {
  const { courseId } = useParams();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDeleteCourse = () => {
    startTransition(async () => {
      const result = await tryCatch(deleteCourse(courseId as string));
      if (result.error) {
        toast.error("An error occurred");
        return;
      }
      if (result?.data?.status === "success") {
        toast.success(result?.data?.message);
        router.push("/admin/courses");
      } else if (result?.data?.status === "error") {
        toast.error(result?.data?.message);
      }
    });
  };
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course</CardTitle>
          <CardDescription>
            This action cannot be undone and will permanently delete the course.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Button asChild variant={"outline"}>
            <Link href={"/admin/courses"}>Cancel</Link>
          </Button>
          <Button
            onClick={handleDeleteCourse}
            disabled={isPending}
            variant={"destructive"}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Course
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
