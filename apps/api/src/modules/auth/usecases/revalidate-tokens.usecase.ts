import { IJWTPayload } from "@tunnel/interfaces";
import * as jwt from "jsonwebtoken";
import { config } from "~/config";
import { Token } from "~/models";
import { generateTokens } from "./generate-tokens.usecase";

export const revalidateTokens = async (refreshToken: string) => {
  // verify the refresh token
  const decoded = jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_PUBLIC_KEY
  ) as IJWTPayload;
  // check in the database if the user still exists
  const token = await Token.findOne({ token: refreshToken });
  if (!token) {
    throw new Error("Refresh token not found");
  }
  const payload: IJWTPayload = {
    level: decoded.level,
    role: decoded.role,
    sub: decoded.sub,
  };
  // delete the old refresh token
  await Token.deleteOne({ token: refreshToken });
  // generate new access token
  const tokens = await generateTokens(payload);
  // return the new tokens
  return tokens;
};
