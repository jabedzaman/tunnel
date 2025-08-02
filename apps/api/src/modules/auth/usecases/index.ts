import { generateOAuthUrl } from "./generate-oauth-url";
import { generateTokens } from "./generate-tokens.usecase";
import { handleGoogleCallback } from "./google-callback.usecase";
import { login } from "./login.usecase";
import { logout } from "./logout.usecase";
import { register } from "./register.usecase";
import { revalidateTokens } from "./revalidate-tokens.usecase";

export const authService = {
  register,
  generateTokens,
  revalidateTokens,
  login,
  logout,
  generateOAuthUrl,
  handleGoogleCallback,
};
