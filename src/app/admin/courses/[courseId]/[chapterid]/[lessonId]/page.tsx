import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import React from "react";
import LessonForm from "./_components/LessonForm";

interface IProps {
  params: Promise<{
    courseId: string;
    chapterid: string;
    lessonId: string;
  }>;
}

const page = async ({ params }: IProps) => {
  const { courseId, chapterid, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);
  return <LessonForm data={lesson} chapterId={chapterid} courseId={courseId} />;
};

export default page;
