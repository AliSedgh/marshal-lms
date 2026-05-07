import { getAllCourses } from "@/app/data/course/get-all-courses";
import React, { Suspense } from "react";
import PublicCourseCard, {
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";

const PublicCoursesPage = () => {
  return (
    <div className="mt-5">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl md:text-4xl tracking-tighter font-bold">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover a wide range of courses from experts in various fields
        </p>
        <div></div>
      </div>
      <Suspense fallback={<RenderCoursesSkeleton />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};

const RenderCourses = async () => {
  const courses = await getAllCourses();
  console.log(courses);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const RenderCoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};
export default PublicCoursesPage;
