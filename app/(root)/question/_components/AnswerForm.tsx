"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import MarkDownEditor from "@/components/shared/MardownEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AnswerSchema } from "@/lib/validations";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { createAnswer } from "@/lib/actions/answers";

const AnswerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof AnswerSchema>) {
    try {
      setIsSubmitting(true);

      await createAnswer({
        description: data.description,
        questionId: params.id,
      });

      form.reset();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h2 className="paragraph-semibold text-dark400_light800">
          Your Answer Goes Here
        </h2>

        <Button className="btn light-border-2 w-fit gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:bg-primary-500">
          <Image
            src={"/assets/icons/stars.svg"}
            alt="AI"
            width={18}
            height={18}
            className="mr-2"
          />
          Generate AI Answer
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <MarkDownEditor field={field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-light-900"
              disabled={isSubmitting}
            >
              {!isSubmitting ? "Submit" : "Submitting..."}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
