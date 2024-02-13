"use server";

import dbConnect from "@/lib/dbConnect";
import Answer from "@/db/answer.model";
import User from "@/db/user.model";
import Question from "@/db/question.model";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import APIError from "../api-error";
import { AnswerSchema } from "../validations";

type CreateAnswerParams = z.infer<typeof AnswerSchema> & {
  questionId: string;
};

export async function createAnswer(params: CreateAnswerParams) {
  let questionIdParam: string;
  try {
    await dbConnect();

    const { success } = AnswerSchema.safeParse(params);

    if (!success) {
      throw new APIError("Invalid input", 400);
    }

    const { description, questionId } = params;
    questionIdParam = questionId;

    const { userId } = auth();

    if (!userId) {
      throw new APIError("You must be logged in to create a question", 401);
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const answer = new Answer({
      description,
      author: user._id,
      question: questionId,
    });

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    console.log("Creating answer...");
    await answer.save();
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }

  revalidatePath(`/question/${questionIdParam}`);
}
