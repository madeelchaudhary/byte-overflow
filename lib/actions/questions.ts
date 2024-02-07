"use server";

import { connect } from "@/db/mongoose";
import { Question } from "@/db/question.model";
import { Tag } from "@/db/tag.model";
import { User } from "@/db/user.model";
import { auth } from "@clerk/nextjs";
import APIError from "../api-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { QuestionSchema } from "../validations";

export async function createQuestion(params: any) {
  try {
    await connect();

    const { title, description, tags } = params;
    const { success } = QuestionSchema.safeParse(params);

    if (!success) {
      throw new APIError("Invalid input", 400);
    }

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
