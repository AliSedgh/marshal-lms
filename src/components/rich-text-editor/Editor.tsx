"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

import Menubar from "./Menubar";
const RichTextEditor = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full rounded-md",
        },
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
          minWidth: 64,
          minHeight: 64,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] focus:outline-none p-4 !w-full !max-w-none prose prose-sm sm:prose lg:prose-lg dark:prose-invert xl:prose-xl prose-img:max-w-full prose-img:rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello World</p>",
  });
  return (
    <div className="w-full border border-input rounded-lg overflow-visible dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
