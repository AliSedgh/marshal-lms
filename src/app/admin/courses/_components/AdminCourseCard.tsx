"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AdminCourseType } from "@/app/data/admin/admin-course";
import useConstructUrl from "@/hooks/use-construct-url";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRightIcon,
  Eye,
  TrashIcon,
  MoreVerticalIcon,
  PencilIcon,
  SchoolIcon,
  TimerIcon,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  course: AdminCourseType;
}

const AdminCourseCard = ({ course }: IProps) => {
  const url = useConstructUrl(course.fileKey);
  return (
    <div>
      <Card className="group relative py-0 gap-0">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <PencilIcon className="size-4 mr-2" />
                  Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/courses/${course.slug}`}>
                  <Eye className="size-4 mr-2" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${course.id}/delete`}>
                  <Trash2 className="size-4 mr-2 text-destructive" />
                  Delete Course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Image
          className="w-full rounded-t-lg aspect-video h-full object-cover"
          src={url ?? ""}
          alt={"thumbnail"}
          width={600}
          height={400}
        />
        <CardContent className="p-4">
          <Link
            className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
            href={`/admin/courses/${course.id}/edit`}
          >
            {course.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">
            {course.smallDescription}
          </p>
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
              <TimerIcon className="size-6 p-1 rounded-md text-primary" />
              <p className="text-sm text-muted-foreground">
                {course.duration} h
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <SchoolIcon className="size-6 p-1 rounded-md text-primary" />
              <p className="text-sm text-muted-foreground">{course.level}</p>
            </div>
          </div>
          <Button asChild className="w-full mt-4">
            <Link href={`/admin/courses/${course.id}/edit`}>
              Edit Course <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourseCard;

export const AdminCourseCardSkeleton = () => {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 flex z-10 items-center gap-x-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full aspect-video rounded-t-lg h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="w-3/4 h-6 mb-2 rounded " />
        <Skeleton className="w-full h-4 mb-4 rounded " />
        <div className="mt-4 flex flex-center gap-x-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="w-10 h-4  rounded" />
        </div>
        <div className="mt-4 flex flex-center gap-x-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="w-10 h-4  rounded" />
        </div>
        <Skeleton className="w-full h-10 mt-4 rounded" />
      </CardContent>
    </Card>
  );
};
