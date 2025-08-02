import { Token } from "~/models";

export const logout = async (refreshToken?: string) => {
  // delete the refresh token
  if (refreshToken) {
    await Token.deleteOne({ token: refreshToken });
  }
};
