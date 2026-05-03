import React, { FC } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  HeadingIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface IProps {
  editor: Editor | null;
}

const Menubar: FC<IProps> = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="border border-input rounded-t-lg p-2 border-t-0 bg-card flex flex-wrap gap-1 border-x-0 items-center">
      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                editor.isActive("bold") && "bg-muted text-muted-foreground",
              )}
            >
              <BoldIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              className={cn(
                editor.isActive("italic") && "bg-muted text-muted-foreground",
              )}
            >
              <ItalicIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              className={cn(
                editor.isActive("strike") && "bg-muted text-muted-foreground",
              )}
            >
              <StrikethroughIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 1 }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <Heading1Icon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 2 }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <Heading2Icon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 3 }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <Heading3Icon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("heading", { level: 4 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 4 }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <Heading4Icon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 4</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              className={cn(
                editor.isActive("bulletList") &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <ListIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bulleted List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              className={cn(
                editor.isActive("orderedList") &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <ListOrderedIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>
      </div>
      <div className="w-px h-6 bg-border mx-2"></div>
      <div className="flex  flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
              className={cn(
                editor.isActive({ textAlign: "left" }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <AlignLeftIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                editor.isActive({ textAlign: "center" }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <AlignCenterIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
              className={cn(
                editor.isActive({ textAlign: "right" }) &&
                  "bg-muted text-muted-foreground",
              )}
            >
              <AlignRightIcon />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
      </div>
      <div className="w-px h-6 bg-border mx-2"></div>
      <div className="flex  flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              size={"sm"}
              variant={"ghost"}
              type="button"
            >
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              size={"sm"}
              variant={"ghost"}
              type="button"
            >
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Menubar;
