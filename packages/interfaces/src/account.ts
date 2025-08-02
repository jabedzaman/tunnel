import { IUser } from "./user";

export interface IAccount {
  _id: string;
  provider: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  scope?: string;
  tokenType?: string;
  sessionState?: string;

  // references
  user: string | IUser;

  // timestamps
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
}
