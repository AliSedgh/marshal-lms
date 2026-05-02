import React, { FC } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";

interface IProps {
  editor: Editor | null;
}

const Menubar: FC<IProps> = ({ editor }) => {
  const isBold =
    useEditorState({
      editor,
      selector: ({ editor: ed }) => ed?.isActive("bold") ?? false,
    }) ?? false;

  const isItalic =
    useEditorState({
      editor,
      selector: ({ editor: ed }) => ed?.isActive("italic") ?? false,
    }) ?? false;

  const isUnderline =
    useEditorState({
      editor,
      selector: ({ editor: ed }) => ed?.isActive("underline") ?? false,
    }) ?? false;

  const isStrike =
    useEditorState({
      editor,
      selector: ({ editor: ed }) => ed?.isActive("strike") ?? false,
    }) ?? false;
  if (!editor) return null;

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size={"sm"}
            pressed={isBold}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            className={cn(isBold && "bg-muted text-muted-foreground")}
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
            pressed={isItalic}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            className={cn(isItalic && "bg-muted text-muted-foreground")}
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
            pressed={isStrike}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            className={cn(isStrike && "bg-muted text-muted-foreground")}
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
            pressed={isStrike}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            className={cn(isStrike && "bg-muted text-muted-foreground")}
          >
            <StrikethroughIcon />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>Strike</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Menubar;
