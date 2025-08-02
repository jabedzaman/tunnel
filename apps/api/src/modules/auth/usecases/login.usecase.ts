import { LoginPayload } from "@tunnel/validators";
import { User } from "~/models";
import { ApiError, httpStatus } from "~/utils";

export const login = async (payload: LoginPayload) => {
  // check if user exists
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }
  // ##TODO: check password
  // return the user
  return { user };
};
