import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export { router as v1Routes };
