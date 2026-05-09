"use client";

import { Button } from "@/components/ui/button";
import { enrollInCourseAction } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2 } from "lucide-react";

const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition();
  const handleEnroll = () => {
    startTransition(async () => {
      const result = await tryCatch(enrollInCourseAction(courseId));
      if (result.error) {
        toast.error("An unexpected error occurred please try again");
        return;
      }
      if (result.data?.status === "success") {
        toast.success(result.data.message);
        window.location.href = result.data.checkoutUrl;
      } else if (result.data?.status === "error") {
        toast.error(result.data.message);
      }
    });
  };
  return (
    <Button onClick={handleEnroll} className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Enroll Now!"
      )}
    </Button>
  );
};

export default EnrollmentButton;
