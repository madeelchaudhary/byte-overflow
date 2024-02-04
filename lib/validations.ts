import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(20).max(2000),
  tags: z.array(z.string()).min(1).max(5),
});
