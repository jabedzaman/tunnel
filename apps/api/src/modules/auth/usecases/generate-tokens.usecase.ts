import { IJWTPayload } from "@tunnel/interfaces";
import * as jwt from "jsonwebtoken";
import { config } from "~/config";
import { Token } from "~/models";

export const generateTokens = async (payload: IJWTPayload) => {
  // generate access token
  const accessToken = jwt.sign(
    payload,
    config.ACCESS_TOKEN_PRIVATE_KEY,
    { expiresIn: "1h", algorithm: "RS256" } // ##FIXME: use config.ACCESS_TOKEN_EXPIRATION
  );
  // generate refresh token
  const refreshToken = jwt.sign(
    payload,
    config.REFRESH_TOKEN_PRIVATE_KEY,
    { expiresIn: "7d", algorithm: "RS256" } // ##FIXME: use config.REFRESH_TOKEN_EXPIRATION
  );
  await Token.create({
    token: refreshToken,
    tokenType: "refresh",
    expiresAt: Date.now(),
    user: payload.sub,
  });
  // return tokens
  return { accessToken, refreshToken };
};
