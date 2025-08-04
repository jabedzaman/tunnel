import ora from "ora";
import open from "open";
import { api } from "~/api";
import inquirer from "inquirer";

export const login = async () => {
  const spinner = ora("Logging in...").start();
  try {
    const { authUrl } = await api.apiKey.create();
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `${authUrl}\nDo you want to open this URL in your browser?`,
      default: true,
    });
    if (!confirm) {
      spinner.warn("Login cancelled by user.");
      return false;
    }
    await open(authUrl);
    spinner.info(`Please authorize in your browser.`);
    spinner.succeed("Login successful!");
  } catch (error) {
    spinner.fail("Login failed. Please try again.");
    console.error(error);
  } finally {
    spinner.stop();
  }
  return true;
};
