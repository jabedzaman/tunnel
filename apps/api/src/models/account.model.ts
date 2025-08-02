import * as mongoose from "mongoose";
import { IAccount } from "@tunnel/interfaces";
import { toJson } from "./plugins";

export interface IAccountDocument extends IAccount, mongoose.Document {
  _id: string;
}

const accountSchema = new mongoose.Schema<IAccountDocument>(
  {
    provider: { type: String, required: true }, // can be "google", "facebook", "github", etc.
    providerAccountId: { type: String, required: true },
    refreshToken: { type: String, required: false },
    accessToken: { type: String, required: false },
    scope: { type: String, required: false },
    tokenType: { type: String, required: false },
    sessionState: { type: String, required: false },

    // references
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "accounts" }
);

// Indexes
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true }); // avoid duplicate accounts for the same provider and account ID

// Plugins
accountSchema.plugin(toJson);

type AccountModel = mongoose.Model<IAccountDocument>;

/**
 * @description Account is a representation of a user's account with an external provider.
 * It includes details such as the provider, access tokens, and associated user information.
 */
export const Account: AccountModel = mongoose.model<IAccountDocument>(
  "Account",
  accountSchema
);
