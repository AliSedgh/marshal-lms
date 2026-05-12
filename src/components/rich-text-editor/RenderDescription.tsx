"use client";
import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";

const RenderDescription = ({ json }: { json: JSONContent }) => {
  const outPut = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);
  return (
    <div className="prose  prose-li:marker:text-primary dark:prose-invert ">
      {parse(outPut)}
    </div>
  );
};

export default RenderDescription;
