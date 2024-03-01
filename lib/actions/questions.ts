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
import { ASK_QUESTION_REPUTATION } from "@/constants";

type CreateQuestionParams = z.infer<typeof QuestionSchema>;
type EditQuestionParams = z.infer<typeof QuestionSchema> & {
  questionId: string;
};

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
        name: { $regex: `^${tag}$`, $options: "i" },
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

    await Interaction.create({
      user: user._id,
      question: question._id,
      action: "ask_question",
      tags: tagsDoc.map((tag) => tag._id),
    });

    await user.updateOne({
      $push: { questions: question._id },
      $inc: { "profile.reputation": ASK_QUESTION_REPUTATION },
    });

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
      User.updateOne(
        { _id: (question.author as any)._id },
        { $pull: { questions: question._id } }
      ),
      User.updateMany(
        { upvotes: question._id },
        { $pull: { upvotes: question._id } }
      ),
      User.updateMany(
        { downvotes: question._id },
        { $pull: { downvotes: question._id } }
      ),
      User.updateMany(
        { saved: question._id },
        { $pull: { saved: question._id } }
      ),
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

export const editQuestion = async (params: EditQuestionParams) => {
  let path = `/question/${params.questionId}`;

  try {
    await dbConnect();

    const { success } = QuestionSchema.safeParse(params);

    if (!success) {
      throw new APIError("Invalid input", 400);
    }

    const { title, description, tags, questionId } = params;

    const { userId } = auth();

    if (!userId) {
      throw new APIError("You must be logged in to edit a question", 401);
    }

    const question = await Question.findById(questionId).populate("author");

    if (!question) {
      throw new APIError("Question not found", 404);
    }

    if ((question.author as any).clerkId !== userId) {
      throw new APIError("You can only edit your own questions", 403);
    }

    const tagsDoc = [];

    for (const tag of tags) {
      const tagDoc = await Tag.findOne({
        name: { $regex: `^${tag}$`, $options: "i" },
      });
      if (tagDoc) {
        if (!tagDoc.questions.includes(question._id)) {
          tagDoc.questions.push(question._id);
          await tagDoc.save();
        }
        tagsDoc.push(tagDoc);
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

    const oldTags = question.tags.map((tag) => tag.toString());
    const newTags = tagsDoc.map((tag) => tag._id.toString());
    const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

    await Tag.updateMany(
      { _id: { $in: tagsToRemove } },
      { $pull: { questions: question._id } }
    );

    question.title = title;
    question.description = description;
    question.tags = tagsDoc.map((tag) => tag._id);

    await question.save();
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }

  revalidatePath(path);
  redirect(path);
};
