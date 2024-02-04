import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ControllerRenderProps } from "react-hook-form";

interface TinymceEditorProps {
  initialValue?: string;
  field: ControllerRenderProps<
    {
      title: string;
      description: string;
      tags: string[];
    },
    "description"
  >;
}

function TinymceEditor({ field, initialValue }: TinymceEditorProps, ref?: any) {
  return (
    <Editor
      value={field.value}
      textareaName={field.name}
      onBlur={field.onBlur}
      onEditorChange={(content) => field.onChange(content)}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      //   onInit={(evt, editor) => (ref.current = editor)}
      initialValue={initialValue || ""}
      init={{
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
      }}
    />
  );
}

export default React.forwardRef(TinymceEditor);
