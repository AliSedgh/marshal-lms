"use client";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import React from "react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface IProps {
  data: CourseSidebarDataType;
  slug: string;
}

const CourseSidebar = ({ data, slug }: IProps) => {
  const pathname = usePathname();

  const currentLessonId = pathname.split("/").pop();
  const { totalLesson, completedLessons, progressPercentage } =
    useCourseProgress({ course: data });
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className=" font-semibold text-base leading-tight  truncate">
              {data.title}
            </h1>
            <p className="text-xs mt-1  text-muted-foreground truncate">
              {data.smallDescription}
            </p>
          </div>
        </div>
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLesson} lessons completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% completed
          </p>
        </div>
      </div>
      <div className="py-4 pr-4 space-y-3">
        {data.chapter.map((chapter) => (
          <Collapsible defaultOpen={chapter.position === 1} key={chapter.id}>
            <CollapsibleTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full p-3 h-auto flex items-center gap-2"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm leading-tight truncate text-muted-foreground">
                    {chapter.position}: {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 border-border space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  slug={slug}
                  lesson={lesson}
                  isActive={lesson.id === currentLessonId}
                  completed={
                    lesson.lessonProgress.find(
                      (item) => item.lessonId === lesson.id,
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
