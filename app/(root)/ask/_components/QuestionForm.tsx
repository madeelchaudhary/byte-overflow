"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";
import QuestionEditor from "./QuestionEditor";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { createQuestion } from "@/lib/actions/questions";

interface QuestionFormProps {
  type?: "ask" | "edit";
}

type Field = ControllerRenderProps<{
  title: string;
  description: string;
  tags: string[];
}>;

const QuestionForm = ({ type = "ask" }: QuestionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [] as string[],
    },
  });

  async function onSubmit(data: z.infer<typeof QuestionSchema>) {
    try {
      setIsSubmitting(true);
      createQuestion(data);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    field: Field
  ) {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      if (field.value.length < 5) {
        const input = e.target as HTMLInputElement;
        const value = input.value.trim();

        if (!value) return;

        if (field.value.includes(value)) {
          form.setError("tags", { message: "Tag already exists" });
          return;
        }

        if (value.length > 20) {
          form.setError("tags", { message: "Tag is too long" });
          return;
        }

        const updatedTags = [...(field.value as string[]), value];
        form.setValue("tags", updatedTags);

        input.value = "";
        form.clearErrors("tags");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your question{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <QuestionEditor field={field} />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Include all the information someone would need to answer your
                question.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  disabled={field.value.length >= 5}
                />
              </FormControl>
              {field.value.length > 0 && (
                <div className="flex-start mt-2.5 gap-2.5">
                  {field.value.map((tag) => (
                    <Badge
                      key={tag}
                      className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md  border-none px-4 py-2 capitalize"
                    >
                      {tag}
                      <Image
                        src="/assets/icons/close.svg"
                        alt="close"
                        width={16}
                        height={16}
                        className="cursor-pointer object-contain invert-0 dark:invert"
                        onClick={() =>
                          form.setValue(
                            "tags",
                            field.value.filter((t) => t !== tag)
                          )
                        }
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 5 tags to describe what your question is about. Tags
                are a great way to find questions about popular topics.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit text-light-900"
          disabled={isSubmitting}
        >
          {type === "ask" && (!isSubmitting ? "Ask Question" : "Asking...")}
          {type === "edit" && (!isSubmitting ? "Edit Question" : "Editing...")}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
