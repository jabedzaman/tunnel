import { approveApiKeySchema, getApiKeySchema } from "@tunnel/validators";
import { Router } from "express";
import { authenticate, validate } from "~/middlewares";
import { apiKeyController } from "~/modules/api-key";

const router: Router = Router();

router.post("/", apiKeyController.create);
router.get("/:apiKeyId", validate(getApiKeySchema), apiKeyController.get);
router.post(
  "/:apiKeyId/approve",
  authenticate(),
  validate(approveApiKeySchema),
  apiKeyController.approve
);

export { router as apiKeyRoutes };
