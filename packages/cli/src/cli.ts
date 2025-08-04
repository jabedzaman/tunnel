#!/usr/bin/env node
import { Command } from "commander";

import packageJson from "../package.json";
import { auth } from "./commands";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("tunnel")
    .description("easy localhost to public")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program.addCommand(auth);

  program.parse();
}

main();
