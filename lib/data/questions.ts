import dbConnect from "@/lib/dbConnect";
import Question from "@/db/question.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import Answer from "@/db/answer.model";

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
}: GetQuestionParams) => {
  await dbConnect();

  const result = await Question.find()
    .populate("tags", undefined, Tag)
    .populate("author", undefined, User)
    .sort({ createdAt: -1 })
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
