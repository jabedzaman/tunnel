import { Request, Response } from "express";
import { apiKeyService } from "./usecases";

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
};
