import { defineConfig } from "tsup";
import "dotenv/config";

const IS_PROD = process.env.NODE_ENV === "production";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/cli.ts"],
  format: ["esm"],
  minify: IS_PROD,
  sourcemap: true,
  external: [/generated/],
  onSuccess: async () => {},
});
