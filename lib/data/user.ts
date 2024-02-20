import User from "@/db/user.model";
import Tag from "@/db/tag.model";
import Question, { IQuestion } from "@/db/question.model";
import dbConnect from "../dbConnect";
import { FilterQuery } from "mongoose";
import { AnswerData, QuestionData, UserData } from "../types";
import Answer from "@/db/answer.model";

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

interface GetUserDocumentsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export const getUsers = async ({ page = 1, pageSize = 10 }: GetUsersParams) => {
  await dbConnect();

  const result = await User.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ createdAt: -1 });

  const users = result.map((user) => {
    return JSON.parse(JSON.stringify(user));
  });

  return users;
};

export const getUserByClerkId = async (clerkId: string) => {
  await dbConnect();

  const user = await User.findOne({ clerkId });

  if (!user) return null;

  return JSON.parse(JSON.stringify(user)) as UserData;
};

export const getSavedQuestions = async ({
  clerkId,
  page = 1,
  pageSize = 10,
  search,
}: GetSavedQuestionsParams) => {
  await dbConnect();

  const searchQuery: FilterQuery<IQuestion> = search
    ? {
        title: { $regex: new RegExp(search, "i") },
      }
    : {};

  const user = await User.findOne({ clerkId }).populate({
    path: "saved",
    model: Question,
    options: {
      limit: pageSize,
      skip: (page - 1) * pageSize,
      sort: { createdAt: -1 },
    },
    populate: [
      { path: "author", model: User },
      { path: "tags", model: Tag },
    ],
    match: searchQuery,
  });

  if (!user) return null;

  return JSON.parse(JSON.stringify(user.saved));
};

export const getUserInfo = async (clerkId: string) => {
  await dbConnect();

  const user = await User.findOne({ clerkId });

  if (!user) return null;

  const totalQuestions = await Question.countDocuments({ author: user._id });
  const totalAnswers = user.answers.length;

  return {
    user,
    totalQuestions,
    totalAnswers,
  };
};

export const getUserQuestions = async ({
  userId,
  page = 1,
  pageSize = 10,
}: GetUserDocumentsParams) => {
  await dbConnect();

  const result = await Question.find({ author: userId })
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ views: -1, upvotes: -1 })
    .populate("tags")
    .populate("author");

  const questions = result.map((question) => {
    return JSON.parse(JSON.stringify(question));
  });

  return questions as QuestionData[];
};

export const getUserAnswers = async ({
  userId,
  page = 1,
  pageSize = 10,
}: GetUserDocumentsParams) => {
  await dbConnect();

  const result = await Answer.find({ author: userId })
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ upvotes: -1 })
    .populate("question")
    .populate("author");

  const answers = result.map((answer) => {
    return JSON.parse(JSON.stringify(answer));
  });

  return answers as AnswerData[];
};
