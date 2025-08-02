import { config } from "~/config";

export const generateOAuthUrl = (provider: "google", redirectUri: string) => {
  switch (provider) {
    case "google":
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.append("client_id", config.GOOGLE_CLIENT_ID);
      url.searchParams.append("redirect_uri", config.GOOGLE_REDIRECT_URI);
      url.searchParams.append("response_type", "code");
      url.searchParams.append("scope", "openid profile email");
      url.searchParams.append("prompt", "consent");
      url.searchParams.append("state", JSON.stringify({ redirectUri }));
      return url.toString();
    default:
      return undefined;
  }
};
