import dbConnect from "@/lib/dbConnect";
import Question, { IQuestion } from "@/db/question.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import Answer from "@/db/answer.model";
import { QuestionData } from "../types";
import { FilterQuery } from "mongoose";
import { PAGE_SIZE } from "@/constants";

interface GetQuestionParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

export const getQuestions = async ({
  page = 1,
  pageSize = PAGE_SIZE,
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
      if (!query.$or) query.$or = [];
      query.$or.push(
        { answers: { $size: 0 } },
        { answers: { $exists: false } }
      );
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

  const totalQuestions = await Question.countDocuments(query);

  const questions = result.map((question) => {
    return JSON.parse(JSON.stringify(question));
  }) as QuestionData[];

  return { questions, totalQuestions };
};

export const getQuestionById = async (id: string) => {
  await dbConnect();

  const result = await Question.findById(id)
    .populate("tags", undefined, Tag)
    .populate("author", undefined, User);

  if (!result) {
    return null;
  }

  const totalAnswers = await Answer.countDocuments({ question: id });

  const question = JSON.parse(JSON.stringify(result)) as QuestionData;

  return {
    question,
    totalAnswers,
  };
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
