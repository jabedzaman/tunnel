export const CONSTS = {
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // At least 8 characters, one uppercase letter, one lowercase letter, and one number
  },

  ROLES: {
    USER: "user",
  },

  AUTH_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true, // required for SameSite=None
    samesite: "none", // cross-origin cookies
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: "/",
    domain: ".localhost", // cookies will be accessible on this domain and its subdomains
  },
};
