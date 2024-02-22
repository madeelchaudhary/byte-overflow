import Tag, { ITag } from "@/db/tag.model";
import Question, { IQuestion } from "@/db/question.model";
import User from "@/db/user.model";
import dbConnect from "../dbConnect";
import { FilterQuery } from "mongoose";

interface GetUserTagsParams {
  userId: string;
  limit?: number;
}

interface GetTagsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
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

export const getTagsWithQuestionsCount = async ({
  search,
  filter,
}: GetTagsParams) => {
  try {
    await dbConnect();

    const searchQuery: FilterQuery<ITag> = {};

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: { [key: string]: any } = {};

    if (filter) {
      if (filter === "recent") {
        sortOptions["createdAt"] = -1;
      } else if (filter === "old") {
        sortOptions["createdAt"] = 1;
      } else if (filter === "popular") {
        sortOptions["questionsCount"] = -1;
      } else if (filter === "name") {
        sortOptions["name"] = 1;
      }
    } else {
      sortOptions["createdAt"] = -1;
    }

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
          createdAt: 1,
        },
      },
      {
        $match: searchQuery,
      },
      {
        $sort: sortOptions,
      },
    ]);

    return tagsWithQuestionsCount;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getQuestionsByTagId = async ({
  tagId,
  page = 1,
  pageSize = 10,
  search,
}: GetQuestionsByTagParams) => {
  await dbConnect();

  const searchQuery: FilterQuery<IQuestion> = {};

  if (search) {
    searchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const tag = await Tag.findById(tagId).populate({
    path: "questions",
    model: Question,
    match: searchQuery,
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

export const getHotTags = async ({ page = 1, pageSize = 5 }) => {
  await dbConnect();

  const result = await Tag.aggregate([
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
        totalQuestions: { $size: "$questions" },
      },
    },
    {
      $sort: { totalQuestions: -1 },
    },
    {
      $skip: (page - 1) * pageSize,
    },
    {
      $limit: pageSize,
    },
  ]);

  return result as { _id: string; name: string; totalQuestions: number }[];
};
