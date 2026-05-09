import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface IProps {
  lesson: CourseSidebarDataType["chapter"][number]["lessons"][number];
  slug: string;
  isActive?: boolean;
  completed?: boolean;
}

const LessonItem = ({ lesson, slug, isActive, completed }: IProps) => {
  return (
    <Button asChild variant={completed ? "secondary" : "outline"}>
      <Link
        className={cn("w-full  py-2.5 h-auto justify-start transition-all", {
          "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200":
            completed,
          "bg-primary/10 border-primary/50 text-primary  dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30":
            isActive && !completed,
        })}
        href={`/dashboard/${slug}/${lesson.id}`}
      >
        <div className="flex items-center gap-2.5 w-full min-w-0">
          <div className="shrink-0">
            {completed ? (
              <div className="size-5 rounded-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center">
                <Check className="size-4 text-white" />
              </div>
            ) : (
              <div
                className={cn(
                  "size-5 flex border items-center justify-center bg-background rounded-full",
                  isActive
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-muted-foreground/50",
                )}
              >
                <Play
                  className={cn(
                    "size-2.5 fill-current",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p
              className={cn("text-xs font-medium truncate", {
                "text-green-800 dark:text-green-200": completed,
              })}
            >
              {lesson.position}.{lesson.title}
            </p>
            {completed && (
              <p className="text-[10px] text-green-700 dark:text-green-300">
                Completed
              </p>
            )}
            {isActive && !completed && (
              <p className="text-[10px] text-primary font-medium">
                Currently Watching
              </p>
            )}
          </div>
        </div>
      </Link>
    </Button>
  );
};

export default LessonItem;
