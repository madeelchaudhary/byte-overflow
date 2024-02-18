import { Schema, model, Document, models, Model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  description: string;
  tags: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type QuestionModel = Model<IQuestion>;

const questionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    views: {
      type: Number,
      default: 0,
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
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default (models.Question ||
  model<IQuestion>("Question", questionSchema)) as QuestionModel;
