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
        "You have reached the maximum number of allowed answer generations for this month.",
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

                Output format: markdown or MD
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

              Format: markdown
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
