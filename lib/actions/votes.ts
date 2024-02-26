"use server";
import { revalidatePath } from "next/cache";

import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import User from "@/db/user.model";
import Interaction from "@/db/interaction.model";
import APIError from "../api-error";
import dbConnect from "../dbConnect";
import {
  DOWNVOTE_ANSWER_REPUTATION,
  DOWNVOTE_QUESTION_REPUTATION,
  UPVOTE_ANSWER_REPUTATION,
  UPVOTE_QUESTION_REPUTATION,
} from "@/constants";

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

    let action: "upvote" | "none" = "none";

    if (question.upvotes.includes(user._id)) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.upvotes = user.upvotes.filter(
        (id) => id.toString() !== question._id.toString()
      );
    } else {
      question.upvotes.push(user._id);
      user.upvotes.push(question._id);

      action = "upvote";
    }

    if (question.downvotes.includes(user._id)) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.downvotes = user.downvotes.filter(
        (id) => id.toString() !== question._id.toString()
      );
    }

    if (action === "upvote") {
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        question: question._id,
        action: "upvote_question",
      });

      if (!existingInteraction) {
        await Interaction.create({
          user: user._id,
          question: question._id,
          action: "upvote_question",
        });

        await User.findByIdAndUpdate(question.author, {
          $inc: { "profile.reputation": UPVOTE_QUESTION_REPUTATION },
        });
      }
    }

    await user.save();
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

    let action: "downvote" | "none" = "none";

    if (question.downvotes.includes(user._id)) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.downvotes = user.downvotes.filter(
        (id) => id.toString() !== question._id.toString()
      );
    } else {
      question.downvotes.push(user._id);
      user.downvotes.push(question._id);

      action = "downvote";
    }

    if (question.upvotes.includes(user._id)) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.upvotes = user.upvotes.filter(
        (id) => id.toString() !== question._id.toString()
      );
    }

    if (action === "downvote") {
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        question: question._id,
        action: "downvote_question",
      });

      if (!existingInteraction) {
        await Interaction.create({
          user: user._id,
          question: question._id,
          action: "downvote_question",
        });

        await User.findByIdAndUpdate(question.author, {
          $inc: { "profile.reputation": -DOWNVOTE_QUESTION_REPUTATION },
        });
      }
    }

    await user.save();
    await question.save();

    revalidatePath(`/question/${questionId}`);
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, status: err.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};

export const upvoteAnswer = async (answerId: string, userId: string) => {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new APIError("Answer not found", 404);
    }

    let action: "upvote" | "none" = "none";

    if (answer.upvotes.includes(user._id)) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.upvotes = user.upvotes.filter(
        (id) => id.toString() !== answer._id.toString()
      );
    } else {
      answer.upvotes.push(user._id);
      user.upvotes.push(answer._id);

      action = "upvote";
    }

    if (answer.downvotes.includes(user._id)) {
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.downvotes = user.downvotes.filter(
        (id) => id.toString() !== answer._id.toString()
      );
    }

    if (action === "upvote") {
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        answer: answer._id,
        action: "upvote_answer",
      });

      if (!existingInteraction) {
        await Interaction.create({
          user: user._id,
          answer: answer._id,
          action: "upvote_answer",
        });

        await User.findByIdAndUpdate(answer.author, {
          $inc: { "profile.reputation": UPVOTE_ANSWER_REPUTATION },
        });
      }
    }

    await user.save();
    await answer.save();

    revalidatePath(`/question/${answer.question.toString()}`);
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, status: err.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};

export const downvoteAnswer = async (answerId: string, userId: string) => {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new APIError("Answer not found", 404);
    }

    let action: "downvote" | "none" = "none";

    if (answer.downvotes.includes(user._id)) {
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.downvotes = user.downvotes.filter(
        (id) => id.toString() !== answer._id.toString()
      );
    } else {
      answer.downvotes.push(user._id);
      user.downvotes.push(answer._id);

      action = "downvote";
    }

    if (answer.upvotes.includes(user._id)) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );

      user.upvotes = user.upvotes.filter(
        (id) => id.toString() !== answer._id.toString()
      );
    }

    if (action === "downvote") {
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        answer: answer._id,
        action: "downvote_answer",
      });

      if (!existingInteraction) {
        await Interaction.create({
          user: user._id,
          answer: answer._id,
          action: "downvote_answer",
        });

        await User.findByIdAndUpdate(answer.author, {
          $inc: { "profile.reputation": -DOWNVOTE_ANSWER_REPUTATION },
        });
      }
    }

    await user.save();
    await answer.save();

    revalidatePath(`/question/${answer.question.toString()}`);
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, status: err.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};
