import { IUser } from "./user";

export interface IApiKey {
  _id: string;

  // references
  user?: string | IUser;
  status: "pending" | "active" | "expired" | "revoked";

  // timestamps
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
}
