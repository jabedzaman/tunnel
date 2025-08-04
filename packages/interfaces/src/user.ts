import { IAccount } from "./account";
import { IApiKey } from "./api-key";
import { IRole } from "./role";

export interface IUser {
  _id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  bio?: string;
  picture?: string;
  location?: {
    timezone?: string;
    city?: string;
    country?: string;
  };
  email?: string;
  emailVerified: boolean;
  role: IRole;

  // references
  accounts: Array<string | IAccount>;
  apiKeys: Array<string | IApiKey>;

  // timestamps
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  lastSeenAt?: number;
  deactivatedAt?: number;
}
