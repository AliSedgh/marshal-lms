import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAdminCourses } from "@/app/data/admin/admin-course";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";

const page = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href={"/admin/courses/create"}>Create Course</Link>
        </Button>
      </div>
      <Suspense fallback={<RenderCoursesSkeleton />}>
        <RenderCourses />
      </Suspense>
    </>
  );
};

const RenderCourses = async () => {
  const courses = await getAdminCourses();
  return (
    <>
      {courses?.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a new course to get started"
          buttonText="Create Course"
          buttonLink="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
};

const RenderCoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default page;
