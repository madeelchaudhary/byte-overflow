import Tag from "@/db/tag.model";
import Question from "@/db/question.model";
import User from "@/db/user.model";
import dbConnect from "../dbConnect";

interface GetUserTagsParams {
  userId: string;
  limit?: number;
}

interface GetTagsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: string;
}

interface GetQuestionsByTagParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export const getUserRelatedTags = async ({
  userId,
  limit,
}: GetUserTagsParams) => {
  await dbConnect();

  //   const result = await User.findById(userId).populate("tags");

  return [
    {
      _id: "1",
      name: "React",
    },
    {
      _id: "2",
      name: "Next.js",
    },
    {
      _id: "3",
      name: "Node.js",
    },
  ];
};

export const getTagsWithQuestionsCount = async () => {
  try {
    await dbConnect();

    const tagsWithQuestionsCount = await Tag.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "tags",
          as: "questions",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          questionsCount: { $size: "$questions" },
        },
      },
    ]);

    return tagsWithQuestionsCount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const GetQuestionsByTagId = async ({
  tagId,
  page = 1,
  pageSize = 10,
  search,
}: GetQuestionsByTagParams) => {
  await dbConnect();

  const tag = await Tag.findById(tagId).populate({
    path: "questions",
    model: Question,
    match: search ? { title: { $regex: search, $options: "i" } } : {},
    options: {
      limit: pageSize,
      skip: (page - 1) * pageSize,
      sort: { createdAt: -1 },
    },
    populate: [
      { path: "author", model: User },
      { path: "tags", model: Tag },
    ],
  });

  if (!tag) {
    return null;
  }

  const questions = JSON.parse(JSON.stringify(tag.questions));

  return { tagId: tag._id, tagTitle: tag.name, questions };
};
