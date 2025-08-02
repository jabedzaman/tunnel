#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program.name("tunnel").description("Easy localhost to public").version("1.0.0");

program
  .command("start")
  .description("Start tunnel")
  .action(() => {
    console.log("Start tunnel");
  });

program.parse();
