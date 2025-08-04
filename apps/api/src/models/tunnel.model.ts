import * as mongoose from "mongoose";
import { ITunnel } from "@tunnel/interfaces";
import { toJson } from "./plugins";

export interface ITunnelDocument extends ITunnel, mongoose.Document {
  _id: string;
}

const tunnelSchema = new mongoose.Schema<ITunnelDocument>(
  {
    localPort: { type: Number, required: true },

    // references
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "tunnels",
  }
);

// Plugins
tunnelSchema.plugin(toJson);

type TunnelModel = mongoose.Model<ITunnelDocument>;

/**
 * @description the Tunnel model represents a tunnel used for local development.
 * It includes details such as the local port, and user.
 */
export const Tunnel: TunnelModel = mongoose.model<ITunnelDocument>(
  "Tunnel",
  tunnelSchema
);
