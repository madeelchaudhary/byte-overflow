import { Schema, model, Document, models } from "mongoose";

export interface IUser extends Document {
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
  questions: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  saved: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IUser["profile"]>(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profile: {
      type: profileSchema,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", userSchema);
