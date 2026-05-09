import { getCourseSidebar } from "@/app/data/course/get-course-sidebar";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface IProps {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: IProps) => {
  const { slug } = await params;
  const course = await getCourseSidebar(slug);
  const firstChapter = course?.chapter[0];
  const firstLesson = firstChapter.lessons[0];
  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center flex-col justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No lessons available </h2>
      <p className="text-muted-foreground">
        This course does not have any lesson yet!
      </p>
    </div>
  );
};

export default page;
