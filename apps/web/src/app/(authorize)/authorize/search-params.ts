import { parseAsString, createLoader } from "nuqs/server";

export const searchParamsCache = createLoader({
  apiKey: parseAsString,
});
