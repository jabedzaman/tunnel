import * as mongoose from "mongoose";
import { IToken } from "@tunnel/interfaces";
import { toJson } from "./plugins";

export interface ITokenDocument extends IToken, mongoose.Document {
  _id: string;
}

const tokenSchema = new mongoose.Schema<ITokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    tokenType: { type: String, required: true, enum: ["access", "refresh"] },

    // references
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // timestamps
    revokedAt: { type: Number, required: false },
    expiresAt: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "tokens",
  }
);

// Plugins
tokenSchema.plugin(toJson);

type TokenModel = mongoose.Model<ITokenDocument>;

/**
 * @description the Token model represents an authentication token used for user sessions.
 * It includes details such as the token value, type, and expiration time.
 */
export const Token: TokenModel = mongoose.model<ITokenDocument>(
  "Token",
  tokenSchema
);
