import { tunnelService } from "./usecases";
import type { Request, Response } from "express";

export const tunnelController = {
  // create a tunnel
  create: async (req: Request, res: Response) => {
    // validate the request body
    const { localPort } = req.body;
    // create the tunnel
    const tunnel = await tunnelService.create({ localPort });
    // return the tunnel details
    res.json({ tunnel });
  },
};
