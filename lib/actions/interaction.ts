"use server";
import Interaction from "@/db/interaction.model";
import Question from "@/db/question.model";
import User from "@/db/user.model";
import APIError from "../api-error";
import { auth } from "@clerk/nextjs";

interface ViewQuestionParams {
  questionId: string;
}

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    const question = await Question.findById(params.questionId);
    if (!question) {
      throw new APIError("Question not found", 404);
    }

    question.views += 1;

    await question.save();

    const { userId } = auth();

    if (userId) {
      const user = await User.findOne({ clerkId: userId });

      if (!user) {
        throw new APIError("User not found", 404);
      }

      const existingInteraction = await Interaction.findOne({
        user: user._id,
        question: question._id,
      });

      if (existingInteraction) {
        return;
      }

      const interaction = new Interaction({
        user: user._id,
        action: "view",
        question: question._id,
      });

      await interaction.save();
    }
  } catch (err) {
    if (err instanceof APIError) {
      throw err;
    }
    throw new APIError("Failed to view question", 500);
  }
}
