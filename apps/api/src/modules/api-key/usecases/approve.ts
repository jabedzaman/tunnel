import { ApproveApiKeyParams } from "@tunnel/validators";
import { ApiKey } from "~/models";
import { ApiError, httpStatus } from "~/utils";

export const apporve = async (userId: string, params: ApproveApiKeyParams) => {
  // 1. find the API key by id
  const apiKey = await ApiKey.findById(params.apiKeyId);
  if (!apiKey) {
    throw new ApiError("API key not found", httpStatus.NOT_FOUND);
  }
  // 2. link the API key to the user
  apiKey.user = userId;
  apiKey.status = "active"; // set the status to active
  await apiKey.save();
  // 3. return the status, expiresAt, and userId
  return {
    status: apiKey.status,
    expiresAt: apiKey.expiresAt,
    userId: apiKey.user,
  };
};
