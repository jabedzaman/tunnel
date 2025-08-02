import { loginSchema, registerSchema } from "@tunnel/validators";
import { Router } from "express";
import { validate } from "~/middlewares";
import { authController } from "~/modules";

const router: Router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.revalidate);
router.post("/logout", authController.logout);

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);

export { router as authRoutes };
