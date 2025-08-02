import { IJWTPayload } from "@tunnel/interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
      permissions?: string[];
    }
  }
}
