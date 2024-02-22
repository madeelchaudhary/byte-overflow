import dbConnect from "@/lib/dbConnect";
import Question, { IQuestion } from "@/db/question.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import Answer from "@/db/answer.model";
import { QuestionData } from "../types";
import { FilterQuery } from "mongoose";

interface GetQuestionParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

export const getQuestions = async ({
  page = 1,
  pageSize = 10,
  search = "",
  filter,
}: GetQuestionParams) => {
  await dbConnect();

  const query: FilterQuery<IQuestion> = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions: { [key: string]: any } = {};

  if (filter) {
    if (filter === "newest") {
      sortOptions["createdAt"] = -1;
    } else if (filter === "frequent") {
      sortOptions["views"] = -1;
    } else if (filter === "unanswered") {
      query.$or = [{ answers: { $size: 0 } }, { answers: { $exists: false } }];
      sortOptions["createdAt"] = -1;
    }
  } else {
    sortOptions["createdAt"] = -1;
  }

  const result = await Question.find(query)
    .populate("tags", undefined, Tag)
    .populate("author", undefined, User)
    .sort(sortOptions)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const questions = result.map((question) => {
    return JSON.parse(JSON.stringify(question));
  });

  return questions;
};

export const getQuestionById = async (id: string) => {
  await dbConnect();

  const question = await Question.findById(id)
    .populate("tags", undefined, Tag)
    .populate("author", undefined, User);

  if (!question) {
    return null;
  }

  const totalAnswers = await Answer.find({ question: id }).countDocuments();

  return { ...JSON.parse(JSON.stringify(question)), totalAnswers };
};

export const getHotQuestions = async ({ page = 1, pageSize = 5 }) => {
  await dbConnect();

  const result = await Question.find()
    .sort({ upvotes: -1, views: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  const questions = result.map((question) => {
    return JSON.parse(JSON.stringify(question));
  });

  return questions as QuestionData[];
};
