"use server";
import User from "@/db/user.model";
import Question from "@/db/question.model";
import dbConnect from "../dbConnect";
import APIError from "../api-error";
import { revalidatePath } from "next/cache";

export const upvoteQuestion = async (questionId: string, userId: string) => {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const question = await Question.findById(questionId);

    if (!question) {
      throw new APIError("Question not found", 404);
    }

    if (question.upvotes.includes(user._id)) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    } else {
      question.upvotes.push(user._id);
    }

    if (question.downvotes.includes(user._id)) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    }

    await question.save();

    revalidatePath(`/question/${questionId}`);
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, status: err.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};

export const downvoteQuestion = async (questionId: string, userId: string) => {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const question = await Question.findById(questionId);

    if (!question) {
      throw new APIError("Question not found", 404);
    }

    if (question.downvotes.includes(user._id)) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    } else {
      question.downvotes.push(user._id);
    }

    if (question.upvotes.includes(user._id)) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );
    }

    await question.save();

    revalidatePath(`/question/${questionId}`);
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, status: err.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};
