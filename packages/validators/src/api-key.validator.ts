import { z } from "zod";

export const getApiKeySchema = z.object({
  params: z.object({
    apiKeyId: z.string(),
  }),
});

export type GetApiKeyParams = z.infer<typeof getApiKeySchema.shape.params>;

export const approveApiKeySchema = z.object({
  params: z.object({
    apiKeyId: z.string(),
  }),
});

export type ApproveApiKeyParams = z.infer<
  typeof approveApiKeySchema.shape.params
>;
