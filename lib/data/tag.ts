import Tag from "@/db/tag.model";
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
