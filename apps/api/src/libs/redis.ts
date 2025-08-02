import Redis from "ioredis";
import { config } from "~/config";

/**
 * @description
 * Redis client instance for caching and other operations.
 */
export const redis = new Redis(config.REDIS_URI, {
  maxRetriesPerRequest: null,
});
