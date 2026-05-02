"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
  });
  return (
    <div>
      <Menubar editor={editor} />
    </div>
  );
};

export default RichTextEditor;
