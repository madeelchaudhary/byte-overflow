import User from "@/db/user.model";
import dbConnect from "../dbConnect";

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

export const getUsers = async ({ page = 1, pageSize = 10 }: GetUsersParams) => {
  await dbConnect();

  const result = await User.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .sort({ createdAt: -1 });

  const users = result.map((user) => {
    return JSON.parse(JSON.stringify(user));
  });

  return users;
};
