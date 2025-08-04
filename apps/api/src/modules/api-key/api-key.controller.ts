import { Request, Response } from "express";
import { apiKeyService } from "./usecases";
import { IJWTPayload } from "@tunnel/interfaces";

export const apiKeyController = {
  // create an API key
  create: async (req: Request, res: Response) => {
    const data = await apiKeyService.create();
    res.json(data);
  },

  // get an API key by ID
  get: async (req: Request, res: Response) => {
    const { apiKeyId } = req.params;
    const data = await apiKeyService.get({ apiKeyId });
    res.json(data);
  },

  // approve an API key
  approve: async (req: Request, res: Response) => {
    const { apiKeyId } = req.params;
    const reqUser = req.user as IJWTPayload;
    const data = await apiKeyService.apporve(reqUser.sub, { apiKeyId });
    res.json(data);
  },
};
