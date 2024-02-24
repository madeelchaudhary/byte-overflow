import { PAGE_SIZE } from "@/constants";
import Answer from "@/db/answer.model";
import { AnswerData } from "../types";

interface GetAnswersParams {
  questionId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
}

export async function getAnswers(params: GetAnswersParams) {
  const { questionId, page = 1, pageSize = PAGE_SIZE, filter } = params;

  const sortOptions: Record<string, any> = {};

  if (filter) {
    if (filter === "oldest") {
      sortOptions["createdAt"] = 1;
    } else if (filter === "recent") {
      sortOptions["createdAt"] = -1;
    } else if (filter === "lowest_upvotes") {
      sortOptions["upvotes"] = 1;
    } else if (filter === "highest_upvotes") {
      sortOptions["upvotes"] = -1;
    }
  } else {
    sortOptions["createdAt"] = -1;
  }

  const result = await Answer.find({ question: questionId })
    .sort(sortOptions)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("author", "profile clerkId email username");

  const totalAnswers = await Answer.countDocuments({ question: questionId });

  const answers = JSON.parse(JSON.stringify(result)) as AnswerData[];

  return { answers, totalAnswers };
}
