import { Command } from "commander";
import { login } from "~/actions";

/**
 * auth command
 */
export const auth = new Command("auth").description("authenticate with tunnel");

auth.command("login").description("login to tunnel").action(login);
