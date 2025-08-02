import { Router } from "express";
import { authenticate } from "~/middlewares";
import { userController } from "~/modules";

const router: Router = Router();

router.get("/", authenticate(), userController.getUser);

export { router as userRoutes };
