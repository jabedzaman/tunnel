import { User } from "~/models";
import { ApiError, httpStatus } from "~/utils";

export const getUser = async (userId: string) => {
  // fetch user from database
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }
  return user;
};
