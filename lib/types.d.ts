import { IAnswer } from "@/db/answer.model";
import { IQuestion } from "@/db/question.model";
import { ITag } from "@/db/tag.model";

interface UserData {
  _id: string;
  username: string;
  email: string;
  password?: string;
  profile: {
    name: string;
    bio?: string;
    avatar: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
  };
  clerkId: string;
  questions: QuestionData[];
  answers: AnswerData[];
  saved: string[];
  upvotes: string[];
  downvotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionData {
  _id: string;
  title: string;
  description: string;
  tags: TagData[];
  answers: AnswerData[];
  views: number;
  upvotes: string[];
  downvotes: string[];
  author: UserData;
  createdAt: Date;
  updatedAt: Date;
}

interface TagData {
  _id: string;
  name: string;
  description: string;
  questions: string[];
  followers: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AnswerData {
  _id: string;
  description: string;
  question: QuestionData;
  upvotes: string[];
  downvotes: string[];
  author: UserData;
  createdAt: Date;
  updatedAt: Date;
}
