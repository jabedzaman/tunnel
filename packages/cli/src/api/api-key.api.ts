import { http } from "~/libs";

export const apiKey = {
  create: async () => {
    try {
      const { data } = await http.post<{
        authUrl: string;
        expiresAt: string;
        status: string;
      }>("/api-key");
      return data;
    } catch (error) {
      throw new Error("Failed to create API key");
    }
  },
};
