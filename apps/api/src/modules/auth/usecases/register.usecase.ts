import { RegisterPayload } from "@tunnel/validators";
import { User } from "~/models";
import { ApiError, httpStatus } from "~/utils";

export const register = async (payload: RegisterPayload) => {
  // check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError("User already exists", httpStatus.BAD_REQUEST);
  }
  // create new user
  const user = await User.create({
    email: payload.email,
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    role: { name: "user", level: 1, permissions: [] },
  });
  // return the created user
  return { user };
};
