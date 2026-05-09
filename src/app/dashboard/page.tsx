import React from "react";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { getAllCourses } from "../data/course/get-all-courses";
import EmptyState from "@/components/general/EmptyState";
import PublicCourseCard from "../(public)/_components/PublicCourseCard";
import Link from "next/link";
import CourseProgressCard from "./_components/CourseProgressCard";

const page = async () => {
  const [allCourses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  console.log(enrolledCourses, "ddfdf", allCourses);

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className=" text-muted-foreground">
          Hear you can see all your enrolled courses
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No enrolled courses"
          description="You haven't enrolled in any courses yet"
          buttonText="Browse Courses"
          buttonLink="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map((enrolledCourse) => (
            <CourseProgressCard
              key={enrolledCourse.course.id}
              course={enrolledCourse}
            />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className=" text-muted-foreground">
            Hear you can see all the available courses
          </p>
        </div>

        {allCourses.filter(
          (course) =>
            !enrolledCourses.some(
              (enrolledCourse) => enrolledCourse.course.id === course.id,
            ),
        ).length === 0 ? (
          <EmptyState
            title="No available courses"
            description="All courses are enrolled"
            buttonText="Browse Courses"
            buttonLink="/courses"
          />
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCourses
                .filter(
                  (course) =>
                    !enrolledCourses.some(
                      (enrolledCourse) =>
                        enrolledCourse.course.id === course.id,
                    ),
                )
                .map((course) => (
                  <PublicCourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default page;
