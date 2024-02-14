import Answer from "@/db/answer.model";

interface GetAnswersParams {
  questionId: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}

export async function getAnswers(params: GetAnswersParams) {
  const { questionId, page = 1, pageSize = 10, sortBy = "createdAt" } = params;

  const answers = await Answer.find({ question: questionId })
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("author", "profile clerkId email username")
    .exec();

  return JSON.parse(JSON.stringify(answers));
}
