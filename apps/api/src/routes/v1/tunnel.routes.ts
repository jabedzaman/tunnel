import { createTunnelSchema } from "@tunnel/validators";
import { Router } from "express";
import { validate } from "~/middlewares";
import { tunnelController } from "~/modules/tunnel";

const router: Router = Router();

router.post("/", validate(createTunnelSchema), tunnelController.create);

export { router as tunnelRoutes };
