"use client";
import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";

const RenderDescription = ({ json }: { json: JSONContent }) => {
  const outPut = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
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
