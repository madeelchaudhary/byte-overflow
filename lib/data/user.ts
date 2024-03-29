import User from "@/db/user.model";
import Tag from "@/db/tag.model";
import Question, { IQuestion } from "@/db/question.model";
import dbConnect from "../dbConnect";
import { FilterQuery } from "mongoose";
import { AnswerData, QuestionData, UserData } from "../types";
import Answer from "@/db/answer.model";
import { PAGE_SIZE } from "@/constants";
import { BadgeCriteriaKey } from "@/constants/badge";
import { countBadges } from "../utils";

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

export const getUsers = async ({
  page = 1,
  pageSize = PAGE_SIZE,
  search,
  filter,
}: GetUsersParams) => {
  await dbConnect();

  const searchQuery: FilterQuery<UserData> = {};

  if (search) {
    searchQuery.$or = [
      { "profile.name": { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions: { [key: string]: any } = {};

  if (filter) {
    if (filter === "new_users") {
      sortOptions["createdAt"] = -1;
    } else if (filter === "old_users") {
      sortOptions["createdAt"] = 1;
    } else if (filter === "top_contributors") {
      sortOptions["profile.reputation"] = -1;
    }
  } else {
    sortOptions["createdAt"] = -1;
  }

  const result = await User.find(searchQuery)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort(sortOptions);

  const totalUsers = await User.countDocuments(searchQuery);

  const users = result.map((user) => {
    return JSON.parse(JSON.stringify(user));
  }) as UserData[];

  return {
    users,
    totalUsers,
  };
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
  pageSize = PAGE_SIZE,
  search,
  filter,
}: GetSavedQuestionsParams) => {
  await dbConnect();

  const searchQuery: FilterQuery<IQuestion> = {};

  if (search) {
    searchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions: { [key: string]: any } = {};

  if (filter) {
    if (filter === "most_recent") {
      sortOptions["createdAt"] = -1;
    } else if (filter === "oldest") {
      sortOptions["createdAt"] = 1;
    } else if (filter === "most_voted") {
      sortOptions["upvotes"] = -1;
    } else if (filter === "most_answered") {
      sortOptions["answers"] = -1;
    } else if (filter === "most_viewed") {
      sortOptions["views"] = -1;
    }
  } else {
    sortOptions["createdAt"] = -1;
  }

  const user = await User.findOne({ clerkId }).populate({
    path: "saved",
    model: Question,
    options: {
      limit: pageSize,
      skip: (page - 1) * pageSize,
      sort: sortOptions,
    },
    populate: [
      { path: "author", model: User },
      { path: "tags", model: Tag },
    ],
    match: searchQuery,
  });

  if (!user) return null;

  let aggregateSearchQuery: FilterQuery<IQuestion> = {};

  if (search)
    aggregateSearchQuery = {
      "question.title": { $regex: search, $options: "i" },
      "question.description": { $regex: search, $options: "i" },
    };

  const savedQuestions = await User.aggregate([
    { $match: { _id: user._id } },

    {
      $lookup: {
        from: "questions",
        localField: "saved",
        foreignField: "_id",
        as: "question",
      },
    },
    { $unwind: "$question" },
    { $match: aggregateSearchQuery },
    { $count: "totalSavedQuestions" },
  ]);

  const totalSavedQuestions =
    savedQuestions.length > 0 ? savedQuestions[0].totalSavedQuestions : 0;

  const questions = user.saved.map((question) => {
    return JSON.parse(JSON.stringify(question));
  }) as QuestionData[];

  return {
    questions,
    totalSavedQuestions,
  };
};

export const getUserInfo = async (clerkId: string) => {
  await dbConnect();

  const user = await User.findOne({ clerkId });

  if (!user) return null;

  const totalQuestions = await Question.countDocuments({ author: user._id });
  const totalAnswers = user.answers.length;
  const questionAggregateResult = await Question.aggregate([
    { $match: { author: user._id } },
    { $project: { upvotes: { $size: "$upvotes" }, views: 1 } },
    {
      $group: {
        _id: null,
        totalUpvotes: { $sum: "$upvotes" },
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  const answerUpvotesResult = await Answer.aggregate([
    { $match: { author: user._id } },
    { $project: { upvotes: { $size: "$upvotes" } } },
    { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
  ]);
  const questionUpvotes = questionAggregateResult[0]?.totalUpvotes || 0;
  const questionViews = questionAggregateResult[0]?.totalViews || 0;
  const answerUpvotes = answerUpvotesResult[0]?.totalUpvotes || 0;

  const criteria: Array<{ type: BadgeCriteriaKey; count: number }> = [
    { type: "QUESTION_COUNT", count: totalQuestions },
    { type: "ANSWER_COUNT", count: totalAnswers },
    { type: "QUESTION_UPVOTES", count: questionUpvotes },
    { type: "ANSWER_UPVOTES", count: answerUpvotes },
    { type: "TOTAL_VIEWS", count: questionViews },
  ];

  const badges = countBadges(criteria);

  return {
    user,
    totalQuestions,
    totalAnswers,
    badges,
  };
};

export const getUserQuestions = async ({
  userId,
  page = 1,
  pageSize = PAGE_SIZE,
}: GetUserDocumentsParams) => {
  await dbConnect();

  const result = await Question.find({ author: userId })
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ views: -1, upvotes: -1 })
    .populate("tags")
    .populate("author");

  const totalQuestions = await Question.countDocuments({ author: userId });

  const questions = result.map((question) => {
    return JSON.parse(JSON.stringify(question));
  }) as QuestionData[];

  return {
    questions,
    totalQuestions,
  };
};

export const getUserAnswers = async ({
  userId,
  page = 1,
  pageSize = PAGE_SIZE,
}: GetUserDocumentsParams) => {
  await dbConnect();

  const result = await Answer.find({ author: userId })
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ upvotes: -1 })
    .populate("question")
    .populate("author");

  const totalAnswers = await Answer.countDocuments({ author: userId });

  const answers = result.map((answer) => {
    return JSON.parse(JSON.stringify(answer));
  }) as AnswerData[];

  return {
    answers,
    totalAnswers,
  };
};
