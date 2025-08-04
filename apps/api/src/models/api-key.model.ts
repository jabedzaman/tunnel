import * as mongoose from "mongoose";
import { IApiKey } from "@tunnel/interfaces";
import { toJson } from "./plugins";

export interface IApiKeyDocument extends IApiKey, mongoose.Document {
  _id: string;
}

const apiKeySchema = new mongoose.Schema<IApiKeyDocument>(
  {
    status: {
      type: String,
      enum: ["pending", "active", "expired", "revoked"],
      default: "pending",
      required: true,
    },
    expiresAt: { type: Number, required: true },

    // references
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "apiKeys",
  }
);

// Plugins
apiKeySchema.plugin(toJson);

type ApiKeyModel = mongoose.Model<IApiKeyDocument>;

/**
 * @description the ApiKey model represents an API key used for authentication.
 * It includes details such as the status, expiration time, and user.
 */
export const ApiKey: ApiKeyModel = mongoose.model<IApiKeyDocument>(
  "ApiKey",
  apiKeySchema
);
