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

export const generateAIAnswer = async (questionId: string) => {
  try {
    const answerWith = process.env.GENERATE_ANSWER_WITH;

    if (answerWith === "gemini") {
      return generateGeminiAnswer(questionId);
    } else if (answerWith === "openai") {
      return generateOpenAIAnswer(questionId);
    } else {
      throw new Error("Answer generation service not found.");
    }
  } catch (error) {
    throw new Error("An error occurred while generating the answer.");
  }
};

async function generateGeminiAnswer(questionId: string) {
  try {
    await dbConnect();

    const question = await Question.findById(questionId).lean();

    if (!question) {
      throw new Error("Question not found.");
    }

    const geminiUrl = process.env.GEMINI_API_URL;
    const res = await fetch(geminiUrl + `?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                Below is the question that needs to be answered:

                Title: ${question.title}
                Explanation in WYSIWYG format: ${question.description}

                Please provide an answer to the question.

                For example, you can provide a code snippet, a link to a resource, or a brief explanation.
              `,
              },
            ],
            role: "user",
          },
        ],
      }),
    });

    const data = await res.json();

    if (res.status !== 200) {
      console.log(data);
      throw new Error("Gemini API failed to generate an answer.");
    }

    const content = data.candidates[0].content.parts[0].text;

    return { content };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while generating the answer.");
  }
}

async function generateOpenAIAnswer(questionId: string) {
  try {
    await dbConnect();

    const question = await Question.findById(questionId).lean();

    if (!question) {
      throw new Error("Question not found.");
    }

    const openaiUrl = process.env.OPENAI_API_URL!;
    const res = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a developer trying to answer a question. Be helpful and concise.",
          },
          {
            role: "user",
            content: `
              Below is the question that needs to be answered:

              ''' 
                Title: ${question.title}
                Explanation in WYSIWYG format: ${question.description}
              '''

              Please provide an answer to the question.

              For example, you can provide a code snippet, a link to a resource, or a brief explanation.
            `,
          },
        ],
      }),
    });

    const data = await res.json();

    if (res.status !== 200) {
      throw new Error(data.error.message);
    }

    const content = data.choices[0].message.content;

    return { content };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while generating the answer.");
  }
}
