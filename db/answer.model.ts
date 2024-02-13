import { Schema, Document, model, Model, models } from "mongoose";

export interface IAnswer extends Document {
  description: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  question: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type AnswerModel = Model<IAnswer>;

const answerSchema = new Schema<IAnswer>(
  {
    description: {
      type: String,
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default (models.Answer ||
  model<IAnswer>("Answer", answerSchema)) as AnswerModel;
