import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(100).max(2000),
  tags: z.array(z.string().min(1).max(20)).min(1).max(5),
});

export const AnswerSchema = z.object({
  description: z.string().min(100).max(2000),
});
