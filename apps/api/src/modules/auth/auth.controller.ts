import { Request, Response } from "express";
import { authService } from "./usecases";
import { ApiError, deleteCookie, httpStatus, setCookie } from "~/utils";

export const authController = {
  register: async (req: Request, res: Response) => {
    // validate the request body
    const { email } = req.body;
    // call the register use case
    const { user } = await authService.register({ email });
    // generate the tokens for the user
    const { accessToken, refreshToken } = await authService.generateTokens({
      role: user.role.name,
      level: user.role.level,
      sub: user.id,
    });
    // set the refresh token in a cookie
    setCookie(res, "refreshToken", refreshToken);
    // send the response
    res.json({ user, accessToken });
  },

  login: async (req: Request, res: Response) => {
    // validate the request body
    const { email } = req.body;
    // call the login use case
    const { user } = await authService.login({ email });
    // generate the tokens for the user
    const { accessToken, refreshToken } = await authService.generateTokens({
      role: user.role.name,
      level: user.role.level,
      sub: user.id,
    });
    // set the refresh token in a cookie
    setCookie(res, "refreshToken", refreshToken);
    // send the response
    res.json({ user, accessToken });
  },

  revalidate: async (req: Request, res: Response) => {
    // get the token from request cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError("No refresh token found", httpStatus.UNAUTHORIZED);
    }
    // call the revalidate use case
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.revalidateTokens(refreshToken);
    // set new refresh token in a cookie
    setCookie(res, "refreshToken", newRefreshToken);
    // send the response
    res.json({ accessToken });
  },

  logout: async (req: Request, res: Response) => {
    // get the token from request cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.json({ success: true });
      return;
    }
    // call the logout use case
    await authService.logout(refreshToken);
    // delete the cookie
    deleteCookie(res, "refreshToken");
    res.json({ success: true });
  },

  googleAuth: async (req: Request, res: Response) => {
    // generate the Google auth URL
    const url = authService.generateOAuthUrl("google", "http://localhost:3000");
    if (!url) {
      throw new ApiError("Invalid provider", httpStatus.BAD_REQUEST);
    }
    // redirect the user to the Google auth URL
    res.redirect(url);
  },

  googleCallback: async (req: Request, res: Response) => {
    // get the code and state from the request query
    const { code, state } = req.query as { code: string; state: string };
    // validate the code and state
    if (!code) {
      throw new ApiError("Invalid request", httpStatus.BAD_REQUEST);
    }
    // call the handleGoogleCallback use case
    const user = await authService.handleGoogleCallback(code, state);
    // generate the tokens for the user
    const { refreshToken } = await authService.generateTokens({
      role: user.role.name,
      level: user.role.level,
      sub: user._id,
    });
    // set the refresh token in a cookie
    setCookie(res, "refreshToken", refreshToken);
    // redirect the user to the home page
    res.redirect("http://localhost:3000");
  },
};
