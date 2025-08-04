import { GetApiKeyParams } from "@tunnel/validators";
import { ApiKey } from "~/models";
import { ApiError, httpStatus } from "~/utils";

export const get = async (params: GetApiKeyParams) => {
  const { apiKeyId } = params; // better DX

  // 1. find the API key by id
  const apiKey = await ApiKey.findById(apiKeyId);
  if (!apiKey) {
    throw new ApiError("API key not found", httpStatus.NOT_FOUND);
  }

  // 2. return the status, expiresAt, and userId
  return {
    status: apiKey.status,
    expiresAt: apiKey.expiresAt,
    userId: apiKey.user,
  };
};
