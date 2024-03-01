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
import { generateAIAnswer } from "@/lib/actions/commons";
import { toast } from "@/components/ui/use-toast";

const AnswerForm = ({ userId }: { userId: string | null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const params = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof AnswerSchema>) {
    if (!userId) return toast({ title: "You must be logged in to answer" });
    try {
      setIsSubmitting(true);

      const result = await createAnswer({
        description: data.description,
        questionId: params.id,
      });

      if (result && result.error) {
        return toast({
          title: result.error,
          variant: "destructive",
        });
      }

      form.reset();
      form.clearErrors();
    } catch (error) {
      toast({
        title: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onGenerateAIAnswer() {
    if (!userId) return toast({ title: "You must be logged in to answer" });
    try {
      setIsSubmittingAI(true);
      const data = await generateAIAnswer(params.id);

      if (data.error)
        return toast({ title: data.error, variant: "destructive" });

      form.setValue("description", data.content!);
    } catch (error) {
      toast({
        title: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAI(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h2 className="paragraph-semibold text-dark400_light800">
          Your Answer Goes Here
        </h2>

        <Button
          className="btn light-border-2 w-fit gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:bg-primary-500"
          onClick={onGenerateAIAnswer}
          disabled={isSubmitting || isSubmittingAI}
        >
          <Image
            src={"/assets/icons/stars.svg"}
            alt="AI"
            width={18}
            height={18}
            className="mr-2"
          />
          {isSubmittingAI ? "Generating..." : "Generate AI Answer"}
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
                  <MarkDownEditor field={field} initialValue="" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-light-900"
              disabled={isSubmitting || isSubmittingAI}
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
