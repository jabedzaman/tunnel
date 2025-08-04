import { ApproveApiKeyParams } from "@tunnel/validators";
import { handleApiError } from "~/lib/helpers";
import { http } from "./lib/axios";

export const apiKey = {
  //approve an API key
  approve: async (params: ApproveApiKeyParams) => {
    try {
      const { data } = await http.post<{
        status: "pending" | "active" | "expired" | "revoked";
      }>(`/api-key/${params.apiKeyId}/approve`);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
