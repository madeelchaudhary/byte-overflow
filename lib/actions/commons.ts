"use server";

import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import Tag from "@/db/tag.model";
import dbConnect from "../dbConnect";

export const globalSearch = async (query: string, filter?: string) => {
  try {
    await dbConnect();

    const searchQuery = { $regex: query, $options: "i" };

    let models = [
      { model: Question, fields: ["title", "description"], type: "question" },
      { model: Tag, fields: ["name"], type: "tag" },
      { model: Answer, fields: ["content"], type: "answer" },
    ];

    if (filter) {
      models = models.filter((model) => model.type === filter);
    }

    const results = await Promise.all(
      models.map(async (model) => {
        const query = model.fields.reduce((acc: any, field) => {
          acc[field] = searchQuery;
          return acc;
        }, {});

        const data = await (model.model as any)
          .find(query as any)
          .limit(5)
          .lean();
        return data.map((item: any) => ({ ...item, type: model.type }));
      })
    );

    const data = JSON.parse(JSON.stringify(results.flat()));

    return data;
  } catch (error) {
    throw new Error("An error occurred while fetching the results.");
  }
};
