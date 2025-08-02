import type { Request, Response, CookieOptions } from "express";
import { CONSTS } from "~/CONSTS";

/**
 * Sets a cookie on the response object.
 * @param {Response} res - The response object.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {CookieOptions} options - The options for the cookie.
 */
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = CONSTS.AUTH_COOKIE_OPTIONS
) => {
  res.cookie(name, value, options);
};

/**
 * Gets a cookie from the request object.
 * @param {Request} req - The request object.
 * @param {string} name - The name of the cookie.
 * @returns {string | undefined} The value of the cookie, or undefined if it doesn't exist.
 */
export const getCookie = (req: Request, name: string): string | undefined => {
  const cookie = req.cookies[name];
  if (cookie) {
    return cookie;
  }
  return undefined;
};

/**
 * Deletes a cookie from the response object.
 * @param {Response} res - The response object.
 * @param {string} name - The name of the cookie.
 */
export const deleteCookie = (res: Response, name: string) => {
  res.cookie(name, "", {
    expires: new Date(Date.now() - 86400000),
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
};
