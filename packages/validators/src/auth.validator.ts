import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.email().transform((email) => email.toLowerCase()),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export type RegisterPayload = z.infer<typeof registerSchema.shape.body>;

export const loginSchema = z.object({
  body: z.object({
    email: z.email().transform((email) => email.toLowerCase()),
  }),
});

export type LoginPayload = z.infer<typeof loginSchema.shape.body>;
