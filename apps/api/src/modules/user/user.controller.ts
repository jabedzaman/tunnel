import type { Request, Response } from "express";
import { userService } from "./usecases";

export const userController = {
  getUser: async (req: Request, res: Response) => {
    // get the user from the request
    const reqUser = req.user;
    if (!reqUser) {
      return { user: null };
    }
    // get user details from the database
    const user = await userService.getUser(reqUser.sub);
    // send the response
    res.json({ user });
  },
};
