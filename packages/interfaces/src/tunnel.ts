import { IUser } from "./user";

export interface ITunnel {
  _id: string;

  localPort: number;

  // references
  user: string | IUser;

  // timestamps
  createdAt: number;
  updatedAt: number;
}
