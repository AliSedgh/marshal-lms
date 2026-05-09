import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar";
import { useMemo } from "react";

interface IProps {
  course: CourseSidebarDataType;
}

export const useCourseProgress = ({ course }: IProps) => {
  return useMemo(() => {
    let totalLesson = 0;
    let completedLessons = 0;
    course.chapter.forEach((chapter) => {
      totalLesson += chapter.lessons.length;
      chapter.lessons.forEach((lesson) => {
        if (lesson.lessonProgress.length > 0) {
          completedLessons++;
        }
      });
    });
    const progressPercentage =
      totalLesson > 0 ? Math.round((completedLessons / totalLesson) * 100) : 0;
    return { totalLesson, completedLessons, progressPercentage };
  }, [course]);
};
