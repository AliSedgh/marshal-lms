import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAdminCourses } from "@/app/data/admin/admin-course";
import AdminCourseCard from "./_components/AdminCourseCard";

const page = async () => {
  const courses = await getAdminCourses();
  console.log("courses", courses);
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href={"/admin/courses/create"}>Create Course</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
};

export default page;
