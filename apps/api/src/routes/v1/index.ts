import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { apiKeyRoutes } from "./api-key.routes";
import { tunnelRoutes } from "./tunnel.routes";

const router: Router = Router();

router.use("/api-key", apiKeyRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/tunnel", tunnelRoutes);

export { router as v1Routes };
