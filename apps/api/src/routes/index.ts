import * as os from "os";
import { Request, Response, Router } from "express";
import { v1Routes } from "./v1";

export const router: Router = Router();

router.use("/v1", v1Routes);

router.get("/", (_: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "tunnel API is running",
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    host: {
      os: os.type(),
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      uptime: os.uptime(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      cpus: os.cpus().length,
      hostname: os.hostname(),
      type: os.type(),
    },
    headers: _.headers,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
  });
});
