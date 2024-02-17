"use server";

import Question from "@/db/question.model";
import User from "@/db/user.model";
import APIError from "../api-error";
import dbConnect from "../dbConnect";
import { revalidatePath } from "next/cache";

interface CreateUserParams {
  clerkId: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar: string;
}

interface UpdateUserParams extends CreateUserParams {}

interface DeleteUserParams {
  clerkId: string;
}

export const getUserById = async (clerkId: string) => {
  await dbConnect();

  const user = await User.findOne({
    clerkId: clerkId,
  });

  return user;
};

export const createUser = async ({
  clerkId,
  username,
  email,
  avatar,
  firstName,
  lastName,
}: CreateUserParams) => {
  await dbConnect();

  const user = new User({
    clerkId: clerkId,
    username: username,
    email: email,
    profile: {
      name: `${firstName}${lastName ? ` ${lastName}` : ""}`,
      avatar: avatar,
    },
  });

  await user.save();

  return user;
};

export const updateUser = async ({
  clerkId,
  username,
  email,
  avatar,
  firstName,
  lastName,
}: UpdateUserParams) => {
  await dbConnect();

  const user = await User.findOne({ clerkId: clerkId });

  if (!user) {
    throw new APIError("User not found", 404);
  }

  user.username = username;
  user.email = email;
  user.profile.name = `${firstName}${lastName ? ` ${lastName}` : ""}`;
  user.profile.avatar = avatar;

  await user.save();

  return user;
};

export const deleteUser = async ({ clerkId }: DeleteUserParams) => {
  await dbConnect();

  const user = await User.findOne({
    clerkId: clerkId,
  });

  if (!user) {
    throw new APIError("User not found", 404);
  }

  // Delete the user data
  await Question.deleteMany({ author: user._id });

  await User.deleteOne({ clerkId: clerkId });

  return user;
};

export const saveQuestion = async (questionId: string, userId: string) => {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    const question = await Question.findById(questionId);

    if (!question) {
      throw new APIError("Question not found", 404);
    }

    if (user.saved.includes(question._id.toString())) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== question._id.toString()
      );
    } else {
      user.saved.push(question._id);
    }

    await user.save();
    revalidatePath(`/question/${questionId}`);
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, status: error.code };
    }
    return { error: "Internal Server Error", status: 500 };
  }
};
