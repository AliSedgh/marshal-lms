"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import useConstructUrl from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { markLessonAsCompleted } from "../actions";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";

interface IProps {
  lesson: LessonContentType;
}

const CourseContent = ({ lesson }: IProps) => {
  const [isPending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  const VideoPlayer = ({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) => {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);
    if (!videoKey)
      return (
        <div className="aspect-video bg-muted flex-col justify-center items-center flex rounded-lg">
          <BookIcon className="size-10 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            This lesson has no video yet, please check back later.
          </p>
        </div>
      );
    return (
      <div className="aspect-video rounded-lg bg-black overflow-hidden">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          poster={thumbnailUrl}
          controls
        >
          <source src={videoUrl} type="/video/mp4" />
          <source src={videoUrl} type="/video/webm" />
          <source src={videoUrl} type="/video/ogg" />
          Your browser dose not support video type
        </video>
      </div>
    );
  };

  const handleMarkLessonAsCompleted = async () => {
    startTransition(async () => {
      const result = await tryCatch(
        markLessonAsCompleted(lesson.id, lesson.chapter.course.slug),
      );
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      if (result.data.status === "success") {
        triggerConfetti();
        toast.success(result.data.message);
      } else {
        toast.error(result.data.message);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey ?? ""}
        videoKey={lesson.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {lesson.lessonProgress.length > 0 ? (
          <Button
            variant={"outline"}
            className="bg-green-500/10! hover:text-green-600! text-green-500 hover:bg-green-500/20"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant={"outline"}
            onClick={handleMarkLessonAsCompleted}
            disabled={isPending}
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <RenderDescription json={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
};

export default CourseContent;
