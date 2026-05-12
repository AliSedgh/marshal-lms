"use client";

import React, { FC, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  Undo,
  Redo,
  ImagePlus,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImageToS3 } from "@/lib/upload-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface IProps {
  editor: Editor | null;
}

function insertImageNode(editor: Editor, src: string) {
  editor
    .chain()
    .focus()
    .insertContent({ type: "image", attrs: { src } })
    .run();
}

const Menubar: FC<IProps> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  if (!editor) return null;

  const onImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const max = 5 * 1024 * 1024;
    if (file.size > max) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    toast.promise(
      uploadImageToS3(file).then((src) => {
        insertImageNode(editor, src);
      }),
      {
        loading: "Uploading image…",
        success: "Image added",
        error: (e) =>
          e instanceof Error ? e.message : "Upload failed",
      },
    );
  };

  const insertImageFromUrl = () => {
    const raw = imageUrl.trim();
    if (!raw) {
      toast.error("Enter an image URL");
      return;
    }
    try {
      const u = new URL(raw);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      insertImageNode(editor, u.href);
      setImageUrl("");
      setUrlDialogOpen(false);
    } catch {
      toast.error("Enter a valid http(s) image URL");
    }
  };

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
      <div className="flex flex-wrap gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          className="sr-only"
          onChange={onImageFileChange}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upload image</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setUrlDialogOpen(true)}
            >
              <Link2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Image from URL</TooltipContent>
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
      <Dialog
        open={urlDialogOpen}
        onOpenChange={(open) => {
          setUrlDialogOpen(open);
          if (!open) setImageUrl("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image URL</DialogTitle>
            <DialogDescription>
              Paste a direct link to an image (https://…).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="rte-image-url">URL</Label>
            <Input
              id="rte-image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  insertImageFromUrl();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUrlDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={insertImageFromUrl}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menubar;
