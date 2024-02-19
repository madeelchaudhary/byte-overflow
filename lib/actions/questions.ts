"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";

import Answer from "@/db/answer.model";
import Interaction from "@/db/interaction.model";
import Question from "@/db/question.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import dbConnect from "@/lib/dbConnect";
import APIError from "../api-error";
import { QuestionSchema } from "../validations";

type CreateQuestionParams = z.infer<typeof QuestionSchema>;

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await dbConnect();

    const { success } = QuestionSchema.safeParse(params);

    if (!success) {
      throw new APIError("Invalid input", 400);
    }

    const { title, description, tags } = params;

    const { userId } = auth();

    if (!userId) {
      throw new APIError("You must be logged in to create a question", 401);
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const question = new Question({
      title,
      description,
      author: user._id,
    });

    const tagsDoc = [];

    for (const tag of tags) {
      const tagDoc = await Tag.findOne({
        name: { $regex: new RegExp(tag, "i") },
      });
      if (tagDoc) {
        tagDoc.questions.push(question._id);
        tagsDoc.push(tagDoc);
        await tagDoc.save();
      } else {
        const newTag = new Tag({
          name: tag,
          description: `Questions related to ${tag}`,
          questions: [question._id],
        });
        tagsDoc.push(newTag);
        await newTag.save();
      }
    }

    // await Promise.all(tagsDoc.map((tag) => tag.save()));
    question.tags = tagsDoc.map((tag) => tag._id);

    console.log("Creating question...");
    await question.save();
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }

  revalidatePath("/");
  redirect("/");
}

export const deleteQuestion = async (questionId: string, path?: string) => {
  try {
    await dbConnect();

    const question = await Question.findById(questionId).populate("author");

    if (!question) {
      throw new APIError("Question not found", 404);
    }

    const { userId } = auth();

    if (!userId) {
      throw new APIError("You must be logged in to delete a question", 401);
    }

    if ((question.author as any).clerkId !== userId) {
      throw new APIError("You can only delete your own questions", 403);
    }

    await Promise.all([
      Answer.deleteMany({ question: question._id }),
      Tag.updateMany(
        { questions: question._id },
        { $pull: { questions: question._id } }
      ),
      Interaction.deleteMany({ question: question._id }),
      question.deleteOne(),
    ]);

    revalidatePath(path || "/");
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};
