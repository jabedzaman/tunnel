import { IUser } from "./user";

export interface IToken {
  _id: string;
  token: string;
  tokenType: "access" | "refresh";

  // references
  user: string | IUser;

  // timestamps
  expiresAt: number;
  revokedAt?: number;
  createdAt: number;
  updatedAt: number;
}
