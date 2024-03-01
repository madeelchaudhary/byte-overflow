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
import Interaction from "@/db/interaction.model";
import { ANSWER_QUESTION_REPUTATION } from "@/constants";

type CreateAnswerParams = z.infer<typeof AnswerSchema> & {
  questionId: string;
};

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await dbConnect();

    const { success } = AnswerSchema.safeParse(params);

    if (!success) {
      throw new APIError("Invalid input", 400);
    }

    const { description, questionId } = params;

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

    await Interaction.create({
      user: user._id,
      question: questionId,
      answer: answer._id,
      action: "answer",
    });

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    await user.updateOne({
      $push: { answers: answer._id },
      $inc: { "profile.reputation": ANSWER_QUESTION_REPUTATION },
    });

    await answer.save();

    revalidatePath(`/question/${questionId}`);
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
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
      Interaction.deleteMany({ answer: answer._id }),
      User.findByIdAndUpdate(author._id, {
        $pull: { answers: answerId },
      }),
      User.updateMany(
        { upvotes: answer._id },
        { $pull: { upvotes: answer._id } }
      ),
      User.updateMany(
        { downvotes: answer._id },
        { $pull: { downvotes: answer._id } }
      ),
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
