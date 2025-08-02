import { z } from "zod";
import "dotenv/config";
import * as path from "node:path";
import * as fs from "node:fs";

export const configSchema = z.object({
  // === APP Configuration ===
  APP_NAME: z.coerce.string().default("@tunnel/api"),
  APP_ENV: z.enum(["development", "production", "test"]).default("production"),

  // === HTTP Server Configuration ===
  HTTP_PORT: z.coerce.number().default(8080),
  HTTP_HOST: z.coerce.string().default("127.0.0.1"),

  // === JWT Configuration ===
  ACCESS_TOKEN_EXPIRATION: z.coerce.string().default("1h"),
  REFRESH_TOKEN_EXPIRATION: z.coerce.string().default("2h"),

  // === Redis Configuration ===
  REDIS_URI: z.coerce.string().default("redis://localhost:6379"),

  // === Database Configuration ===
  MONGO_URI: z.coerce.string().default("mongodb://localhost:27017"),

  // === S3 Configuration ===
  S3_ENDPOINT: z.coerce.string().default("http://localhost:9000"),
  S3_ACCESS_KEY: z.coerce.string().default("minioadmin"),
  S3_SECRET_KEY: z.coerce.string().default("minioadmin"),
  S3_BUCKET: z.coerce.string().default("tunnel"),
  S3_REGION: z.coerce.string().default("us-east-1"),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  S3_USE_SSL: z.coerce.boolean().default(false),

  // === GOOGLE Configuration ===
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});

export type Config = z.infer<typeof configSchema> & {
  ACCESS_TOKEN_PUBLIC_KEY: string;
  REFRESH_TOKEN_PUBLIC_KEY: string;
  ACCESS_TOKEN_PRIVATE_KEY: string;
  REFRESH_TOKEN_PRIVATE_KEY: string;
};

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  throw new Error(
    `Invalid environment variables: ${parsedConfig.error.issues
      .map((issue) => issue.message)
      .join(", ")}`
  );
}

// read the keys from the filesystem
const keyDir = path.resolve(__dirname, "../../../../keys");

// append keys to the config
export const config: Config = {
  ...parsedConfig.data,
  ACCESS_TOKEN_PUBLIC_KEY: fs.readFileSync(
    path.join(keyDir, "public.pem"),
    "utf-8"
  ),
  REFRESH_TOKEN_PUBLIC_KEY: fs.readFileSync(
    path.join(keyDir, "public.pem"),
    "utf-8"
  ),
  ACCESS_TOKEN_PRIVATE_KEY: fs.readFileSync(
    path.join(keyDir, "private.pem"),
    "utf-8"
  ),
  REFRESH_TOKEN_PRIVATE_KEY: fs.readFileSync(
    path.join(keyDir, "private.pem"),
    "utf-8"
  ),
};
