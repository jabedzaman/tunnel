import { config } from "~/config";
import jwksClient from "jwks-rsa";
import { ApiError, httpStatus } from "~/utils";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import { Account, User } from "~/models";
import { IUser } from "@tunnel/interfaces";

export const handleGoogleCallback = async (code: string, state: string) => {
  try {
    // exchange code for tokens
    const { data } = await axios.post<{ id_token: string }>(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: config.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // decode ID token header
    const decoded = jwt.decode(data.id_token, { complete: true });
    if (!decoded || typeof decoded === "string") {
      throw new ApiError("Invalid ID token", httpStatus.UNAUTHORIZED);
    }

    const kid = decoded.header.kid;
    const client = jwksClient({
      jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
    });
    const key = await client.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    // verify token
    const verified = jwt.verify(data.id_token, publicKey) as {
      sub: string;
      email: string;
      given_name: string;
      family_name: string;
      picture: string;
    };

    // check for existing account
    const existingAccount = await Account.findOne({
      provider: "google",
      providerAccountId: verified.sub,
    }).populate("user");

    if (existingAccount?.user) {
      return existingAccount.user as IUser;
    }

    // check for user by email
    let user = await User.findOne({ email: verified.email });

    if (!user) {
      user = await User.create({
        email: verified.email,
        firstName: verified.given_name,
        lastName: verified.family_name,
        emailVerified: true,
        role: { name: "user", level: 1, permissions: [] },
        picture: verified.picture,
      });
    }

    const account = await Account.create({
      provider: "google",
      providerAccountId: verified.sub,
      user: user._id,
    });

    user.accounts.push(account._id); // link account to user
    await user.save();

    return user;
  } catch (error) {
    throw new ApiError(
      "Failed to handle Google callback",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
