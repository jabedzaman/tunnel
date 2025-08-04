import { Router } from "express";
import { apiKeyController } from "~/modules/api-key";

const router: Router = Router();

router.post("/", apiKeyController.create);
router.get("/:apiKeyId", apiKeyController.get);

export { router as apiKeyRoutes };
