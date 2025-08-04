import z from "zod";

export const createTunnelSchema = z.object({
  body: z.object({
    localPort: z.number().min(1024).max(65535),
  }),
});

export type CreateTunnelPayload = z.infer<typeof createTunnelSchema.shape.body>;
