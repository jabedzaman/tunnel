import * as mongoose from "mongoose";
import { IUser } from "@tunnel/interfaces";
import { CONSTS } from "~/CONSTS";
import { toJson } from "./plugins";

export interface IUserDocument extends IUser, mongoose.Document {
  _id: string;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: false,
      sparse: true, // allow null or undefined emails
      unique: true,
      match: [CONSTS.REGEX.EMAIL, "Invalid email address"],
    },
    emailVerified: { type: Boolean, default: false },
    firstName: { type: String, required: false },
    middleName: { type: String, required: false },
    lastName: { type: String, required: false },
    bio: { type: String, required: false },
    picture: { type: String, required: false },
    location: {
      timezone: { type: String, required: false },
      city: { type: String, required: false },
      country: { type: String, required: false },
    },
    role: {
      level: { type: Number, default: 1 },
      name: {
        type: String,
        enum: ["guest", "user", "admin"],
        default: "user",
      },
      permissions: { type: Array, default: [] },
    },

    // references
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    apiKeys: [{ type: mongoose.Schema.Types.ObjectId, ref: "ApiKey" }],

    // timestamps
    deletedAt: { type: Date, required: false },
    deactivatedAt: { type: Date, required: false },
    lastSeenAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Plugins
userSchema.plugin(toJson);

type UserModel = mongoose.Model<IUserDocument>;

/**
 * @description User represents an individual user in the system, including their personal details and role.
 */
export const User: UserModel = mongoose.model<IUserDocument>(
  "User",
  userSchema
);
