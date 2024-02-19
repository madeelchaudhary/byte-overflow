"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import * as z from "zod";

import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import User, { IUser } from "@/db/user.model";
import dbConnect from "@/lib/dbConnect";
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

export const deleteAnswer = async (answerId: string, path?: string) => {
  try {
    await dbConnect();

    const answer = await Answer.findById(answerId).populate("author");

    if (!answer) {
      throw new APIError("Answer not found", 404);
    }

    const { userId } = auth();
    const author = answer.author as unknown as IUser;

    if (!userId) {
      throw new APIError("You must be logged in to delete an answer", 401);
    }

    if (userId !== author.clerkId) {
      throw new APIError("You are not authorized to delete this answer", 403);
    }

    await Promise.all([
      User.findByIdAndUpdate(author._id, {
        $pull: { answers: answerId },
      }),
      Question.findByIdAndUpdate(answer.question, {
        $pull: { answers: answerId },
      }),
      Answer.findByIdAndDelete(answerId),
    ]);

    revalidatePath(path || "/");
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};
