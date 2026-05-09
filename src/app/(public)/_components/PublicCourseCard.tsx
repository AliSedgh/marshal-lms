"use client";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/use-construct-url";
import { ArrowRightIcon, SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  course: PublicCourseType[number];
}

const PublicCourseCard = ({ course }: IProps) => {
  const url = useConstructUrl(course.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2" variant="outline">
        {course.level}
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
          href={`/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">
          {course.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration} h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>
        </div>
        <Button asChild className="w-full mt-4">
          <Link href={`/courses/${course.slug}`}>
            View Course <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PublicCourseCard;

export const PublicCourseCardSkeleton = () => {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-lg aspect-video object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className=" h-6 w-2" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md " />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md " />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};
