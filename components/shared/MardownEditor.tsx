"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ControllerRenderProps } from "react-hook-form";
import { useTheme } from "@/store/ThemeProvider";

interface TinymceEditorProps {
  initialValue?: string;
  field: ControllerRenderProps<any, any>;
}

function TinymceEditor({ field, initialValue }: TinymceEditorProps, ref?: any) {
  const { theme } = useTheme()!;

  return (
    <Editor
      value={field.value}
      textareaName={field.name}
      onBlur={field.onBlur}
      onEditorChange={(content) => field.onChange(content)}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => {
        if (ref) {
          ref.current = editor;
        }
      }}
      initialValue={initialValue || ""}
      init={{
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
          { text: "PHP", value: "php" },
          { text: "Ruby", value: "ruby" },
          { text: "Python", value: "python" },
          { text: "Java", value: "java" },
          { text: "C", value: "c" },
          { text: "C#", value: "csharp" },
          { text: "C++", value: "cpp" },
          { text: "Dart", value: "dart" },
          { text: "Go", value: "go" },
          { text: "Kotlin", value: "kotlin" },
          { text: "Rust", value: "rust" },
          { text: "SQL", value: "sql" },
          { text: "Bash", value: "bash" },
          { text: "Sass", value: "sass" },
          { text: "Solidity", value: "solidity" },
          { text: "JSON", value: "json" },
          { text: "JSX", value: "jsx" },
          { text: "TypeScript", value: "typescript" },
        ],
        height: 350,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "codesample",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "wordcount",
        ],
        toolbar:
          "undo redo | " +
          "blocks | " +
          "bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "codesample bullist numlist outdent indent",
        content_style: "body { font-family: Inter,sans-serif; font-size:14px }",
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
      }}
    />
  );
}

const MarkDownEditor = React.forwardRef(TinymceEditor);
export default MarkDownEditor;
