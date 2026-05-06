"use client";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Trash2,
  FileText,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createChapter } from "../../../create/actions";
import { reorderChapters, reorderLessons } from "../action";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import DeleteLesson from "./DeleteLesson";
import DeleteChapter from "./DeleteChater";

interface IProps {
  data: AdminCourseSingularType;
}

interface ISortableItem {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type?: "lesson" | "chapter";
    chapterId?: string;
  };
}
const CourseStructure = ({ data }: IProps) => {
  const initialItems = data.chapter.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons:
      chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })) || [],
  }));

  const [items, setItems] = useState(initialItems);
  const SortableItem = ({ id, children, className, data }: ISortableItem) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "relative w-full min-w-0 touch-none cursor-grab",
          className,
          isDragging && "z-9999",
        )}
      >
        {children(listeners)}
      </div>
    );
  };

  useEffect(() => {
    if (data) {
      setItems((prev) =>
        data.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: prev.find((item) => item.id === chapter.id)?.isOpen ?? true,
          lessons:
            chapter.lessons.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              order: lesson.position,
            })) || [],
        })),
      );
    }
  }, [data]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;
    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error("could not determine target chapter");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("could not find chapter old/new index for reordering");
        return;
      }
      const previousItems = [...items];
      const newItems = arrayMove(items, oldIndex, newIndex);
      const updateForChapters = newItems.map((item) => ({
        id: item.id,
        position: item.order,
      }));
      setItems(newItems);

      const reorderChaptersPromise = () =>
        reorderChapters(courseId, updateForChapters);
      toast.promise(reorderChaptersPromise(), {
        loading: "Reordering Chapters...",

        success: (result) => {
          if (result?.status === "success") return result.message;
          throw new Error(result?.message);
        },
        error: () => {
          setItems(previousItems);
          return "Failed to reorder Chapters";
        },
      });
      return;
    }
    if (overType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;
      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Lesson move between different chapters or invalid chapter ID is",
        );
        return;
      }

      const chapterIndex = items.findIndex((item) => item.id === chapterId);
      if (chapterIndex === -1) {
        toast.error("could not find chapter index for reordering");
        return;
      }
      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId,
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId,
      );
      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("could not find lesson old/new index for reordering");
        return;
      }
      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex,
      );
      const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };
      const previousItems = [...items];
      setItems(newItems);
      if (courseId) {
        const lessonForUpdate = reorderedLessons.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reorderLessonPromise = () =>
          reorderLessons(lessonForUpdate, chapterId, courseId);
        toast.promise(reorderLessonPromise(), {
          loading: "Reordering Lessons",

          success: (result) => {
            if (result?.status === "success") return result.message;
            console.log("Failed to reorder lessons", result);
            throw new Error(result?.message);
          },
          error: (error) => {
            setItems(previousItems);
            console.log("Failed to reorder lessons", error);
            return "Failed to reorder lessons";
          },
        });
      }
      return;
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleChapter = (open: boolean, id: string) => {
    const mapData = items.map((item) =>
      item.id === id ? { ...item, isOpen: open } : item,
    );
    setItems(mapData);
  };
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
      sensors={sensors}
    >
      <Card className="overflow-visible">
        <CardHeader className="flex items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter", chapterId: item.id }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={(open) => toggleChapter(open, item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapter chapterId={item.id} courseId={data.id} />
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={item.lessons.map((lesson) => lesson.id)}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(listeners) => (
                                  <div className="flex items-center rounded-sm justify-between hover:bg-accent p-3 border-b border-border">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...listeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                        className="cursor-pointer hover:text-primary"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson
                                      chapterId={item.id}
                                      lessonId={lesson.id}
                                      courseId={data.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal
                              courseId={data.id}
                              chapterId={item.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;
