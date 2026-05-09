import { getLessonContent } from "@/app/data/course/get-lesson-content";
import React, { Suspense } from "react";
import CourseContent from "./_components/CourseContent";
import LessonSkeleton from "./_components/LessonSkeleton";

interface IProps {
  params: Promise<{ lessonId: string }>;
}

const page = async ({ params }: IProps) => {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
};

export default page;

const LessonContentLoader = async ({ lessonId }: { lessonId: string }) => {
  const lesson = await getLessonContent(lessonId);
  return <CourseContent lesson={lesson} />;
};
