import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(100).max(2555),
  tags: z.array(z.string().min(1).max(20)).min(1).max(5),
});

export const AnswerSchema = z.object({
  description: z.string().min(100).max(2555),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(255),
  bio: z.string().min(100).max(512).optional(),
  location: z.string().min(3).max(255).optional(),
  portfolio: z.string().url().optional(),
});
