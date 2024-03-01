"use server";

import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import Interaction from "@/db/interaction.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import dbConnect from "../dbConnect";
import { auth } from "@clerk/nextjs";
import APIError from "../api-error";
import { GENERATIONS_ALLOWED_PER_MONTH } from "@/constants";
import showdown from "showdown";
import { getAIAnswerPrompt } from "../utils";

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
    const { userId } = auth();

    if (!userId) {
      throw new APIError("You are not authorized to perform this action.", 401);
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new APIError("User not found.", 404);
    }

    const generations = await Interaction.find({
      user: user._id,
      action: "generation",
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    if (generations.length >= GENERATIONS_ALLOWED_PER_MONTH) {
      throw new APIError(
        "You have reached the limit of answer generations allowed per month.",
        400
      );
    }

    const codeBlockExtension: showdown.ShowdownExtension = {
      type: "output",
      regex:
        /<pre><code class="[\s\S]+?language-(\w+)">([\s\S]+?)<\/code><\/pre>/g,
      replace: function (match: any, language: any, code: any) {
        const preClass = `s-code-block language-${language}`;
        const codeClass = `hljs language-${language}`;
        return `<pre class="${preClass}"><code class="${codeClass}">${code}</code></pre>`;
      },
    };
    const converter = new showdown.Converter({
      openLinksInNewWindow: true,
      extensions: [codeBlockExtension],
    });
    converter.setFlavor("ghost");

    const answerWith = process.env.GENERATE_ANSWER_WITH;

    if (answerWith === "gemini") {
      const result = await generateGeminiAnswer(questionId);

      await Interaction.create({
        user: user._id,
        action: "generation",
        question: questionId,
      });

      const content = converter.makeHtml(result.content);

      return { content };
    } else if (answerWith === "openai") {
      const result = await generateOpenAIAnswer(questionId);

      await Interaction.create({
        user: user._id,
        action: "generation",
        question: questionId,
      });

      const content = converter.makeHtml(result.content);

      return { content };
    } else {
      throw new APIError("Answer generation service not found.", 404);
    }
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return {
      error: "An error occurred while generating the answer.",
      status: 500,
    };
  }
};

async function generateGeminiAnswer(questionId: string) {
  await dbConnect();

  const question = await Question.findById(questionId).lean();

  if (!question) {
    throw new APIError("Question not found.", 404);
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
              text: getAIAnswerPrompt(question.title, question.description),
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
    throw new APIError("Gemini API failed to generate an answer.", 500);
  }

  const content = data.candidates[0].content.parts[0].text;

  return { content };
}

async function generateOpenAIAnswer(questionId: string) {
  await dbConnect();

  const question = await Question.findById(questionId).lean();

  if (!question) {
    throw new APIError("Question not found.", 404);
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
          content: getAIAnswerPrompt(question.title, question.description),
        },
      ],
    }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new APIError("OpenAI API failed to generate an answer.", 500);
  }

  const content = data.choices[0].message.content;

  return { content };
}
