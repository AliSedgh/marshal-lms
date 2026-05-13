import Image from "next/image";
import React, { FC } from "react";
import { getIndividualCourse } from "@/app/data/course/get-course";
import { env } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkInCourseBought } from "@/app/data/user/user-is-enroll";
import Link from "next/link";
import EnrollmentButton from "./_components/EnrollmentButton";
import { CommentForm } from "./_components/comments/CommentForm";
import { CommentList } from "./_components/comments/CommentList";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface IProps {
  params: Promise<{ courseSlug: string }>;
}

const SlugPage: FC<IProps> = async ({ params }) => {
  const { courseSlug } = await params;
  const course = await getIndividualCourse(courseSlug);
  const isEnrolled = await checkInCourseBought(course.id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAuthenticated = Boolean(session?.user);
  const url = `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.tigrisfiles.io/${course.fileKey}`;

  return (
    <>
    <div className="grid grid-cols-1 mt-5 lg:grid-cols-3 gap-8">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={url}
            alt="thumbnail image"
            fill
            className="w-full rounded-t-lg aspect-video h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-x-4">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              {course.level}
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              {course.category}
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              {course.duration} h
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>
            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapter.length} chapters |{" "}
              {course.chapter.reduce(
                (acc, curr) => acc + curr.lessons.length,
                0,
              )}{" "}
              lessons
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-8">
          {course.chapter.map((chapter, index) => (
            <Collapsible defaultOpen={index === 0} key={chapter.id}>
              <Card className="pb-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                <CollapsibleTrigger>
                  <div>
                    <CardContent className="p-6 h-full hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="flex size-10 rounded-full justify-center items-center text-primary font-semibold bg-primary/10">
                            {index + 1}
                          </p>
                          <div>
                            <h3 className="text-xl text-left font-semibold">
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 text-left">
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={"outline"} className="text-xs">
                            {chapter.lessons.length} lesson
                            {chapter.lessons.length > 1 ? "s" : ""}
                          </Badge>
                          <IconChevronDown className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t bg-muted/20">
                    <div className="p-6 pt-4 space-y-3">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 rounded-lg hover:bg-accent p-3 transition-colors duration-200"
                        >
                          <div className="flex size-8 justify-center rounded-full bg-background  border-2 border-primary/20 items-center gap-2">
                            <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-left font-medium">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 text-left">
                              Lesson {lessonIndex + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium text-muted-foreground">
                  Price
                </span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>
              <div className="space-y-2 mb-6 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center size-9 rounded-full justify-center bg-primary/10 gap-2">
                      <IconClock className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center size-9 rounded-full justify-center bg-primary/10 gap-2">
                      <IconChartBar className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Level</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center size-9 rounded-full justify-center bg-primary/10 gap-2">
                      <IconCategory className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Category</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center size-9 rounded-full justify-center bg-primary/10 gap-2">
                      <IconBook className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">total lessons</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.chapter.reduce(
                          (acc, curr) => acc + curr.lessons.length,
                          0,
                        )}{" "}
                        lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-3">
                <h4>This course includes:</h4>

                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Access On mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              {isEnrolled ? (
                <Button className="w-full">
                  <Link href={"/dashboard"}>Watch Course</Link>
                </Button>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}

              <p className="text-xs text-muted-foreground mt-3">
                30-day mony-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <section className="mt-14 space-y-8 border-t pt-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Comments</h2>
        <p className="text-sm text-muted-foreground">
          Questions and discussion about this course.
        </p>
      </div>
      <CommentList courseId={course.id} />
      <CommentForm
        courseId={course.id}
        isAuthenticated={isAuthenticated}
      />
    </section>
    </>
  );
};

export default SlugPage;
