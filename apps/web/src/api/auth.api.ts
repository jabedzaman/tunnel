import { LoginPayload, RegisterPayload } from "@tunnel/validators";
import { http } from "./lib/axios";
import { IUser } from "@tunnel/interfaces";
import { handleApiError } from "~/lib/helpers";

export const auth = {
  register: async (payload: RegisterPayload) => {
    try {
      const { data } = await http.post<{ user: IUser; accessToken: string }>(
        "/auth/register",
        payload
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  login: async (payload: LoginPayload) => {
    try {
      const { data } = await http.post<{ user: IUser; accessToken: string }>(
        "/auth/login",
        payload
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await http.post("/auth/logout");
    } catch (error) {
      return handleApiError(error);
    }
  },

  oauth: (provider: "google" | "apple" | "meta") => {
    return `http://localhost:8080/v1/auth/${provider}`;
  },
};
