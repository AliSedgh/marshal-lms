"use client";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { ArrowRightIcon, SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  course: EnrolledCourseType;
}

const CourseProgressCard = ({ course }: IProps) => {
  const url = useConstructUrl(course.course.fileKey);
  const { completedLessons, progressPercentage, totalLesson } =
    useCourseProgress({ course: course.course as any });
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2" variant="outline">
        {course.course.level}
      </Badge>
      <Image
        src={url}
        alt="thumbnail image"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${course.course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.course.title}
        </Link>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">
          {course.course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex items-center gap-x-2 justify-between  mb-1">
            <p>progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress className="h-1.5" value={progressPercentage} />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLesson} lessons completed
          </p>
        </div>

        <Button asChild className="w-full mt-4">
          <Link href={`/dashboard/${course.course.slug}`}>
            View Course <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;
