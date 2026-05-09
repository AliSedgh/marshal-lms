import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import EmptyState from "@/components/general/EmptyState";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./courses/_components/AdminCourseCard";

export default async function Page() {
  const enrollmentStats = await adminGetEnrollmentStats();
  return (
    <>
      <SectionCards />

      <ChartAreaInteractive data={enrollmentStats} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Courses</h2>
          <Button asChild variant={"outline"}>
            <Link href={"/courses"}>View All Courses</Link>
          </Button>
        </div>
        <Suspense fallback={<RecentRenderCoursesSkeleton />}>
          <RecentRenderCourses />
        </Suspense>
      </div>
    </>
  );
}

const RecentRenderCourses = async () => {
  const data = await adminGetRecentCourses();
  if (data.length === 0)
    return (
      <EmptyState
        title="You dont have any courses"
        buttonLink="/admin/course/create"
        buttonText="'Create new Course"
        description="you dont have any courses.create some to se them here"
      />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

const RecentRenderCoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};
