import ora, { Ora } from "ora";
import open from "open";
import { api } from "~/api";
import inquirer from "inquirer";

export const login = async () => {
  // variable to hold the poll and timeout timers
  let pollTimer: number | null = null;
  let timeoutTimer: number | null = null;

  // 1. spinner for the login process
  const spinner = ora("creating auth session").start();
  try {
    // 2. create the API key
    const { authUrl } = await api.apiKey.create();
    spinner.succeed("Auth session created successfully!");
    // 3. ask the user if they want to open the URL in their browser
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `${authUrl}\nDo you want to open this URL in your browser?`,
      default: true,
      choices: ["y", "n"],
    });
    if (!confirm) {
      spinner.warn("Login cancelled by user.");
    }
    // 4. open the URL in the browser
    await open(authUrl);
    // 5. poll the API for the status of the API key
    const authSpinner = ora("Waiting for authentication...").start();
    const apiKey = extractApiKey(authUrl);
    if (!apiKey) {
      throw new Error("Failed to extract API key from URL");
    }
    const { success } = await poll(apiKey, authSpinner);
    if (success) {
      authSpinner.succeed("Authentication successful!");
      // ##TODO: save token to ~/
    } else {
      // ##TODO: handle timeout
      throw new Error("Authentication failed or timed out.");
    }
  } catch (error) {
    if (spinner.isSpinning) spinner.fail("Authentication failed");
    if (pollTimer) clearInterval(pollTimer);
    if (timeoutTimer) clearTimeout(timeoutTimer);
    spinner.fail("Login failed!");
  }
};

/**
 *
 * @param url the URL to poll for authentication status
 * @return the apiKey extracted from the URL
 * example URL: https://tunnel.com/authorize?apiKey=1234567890abcdefghijklmnopqrstuvwxyz
 * example apiKey: 1234567890abcdefghijklmnopqrstuvwxyz
 */
const extractApiKey = (url: string) => {
  const urlParts = url.split("?");
  const queryString = urlParts[1];
  const params = new URLSearchParams(queryString);
  return params.get("apiKey");
};

const poll = async (apiKey: string, spinner: Ora) => {
  return new Promise<{
    success: boolean;
  }>((resolve, reject) => {
    let attempts: number = 0;
    const maxAttempts = 30; // Maximum number of attempts to poll

    const pollInterval = setInterval(async () => {
      attempts++; // Increment the attempt count
      try {
        const { status } = await api.apiKey.get({ apiKey });
        if (status === "active") {
          clearInterval(pollInterval);
          resolve({ success: true });
        } else if (status === "expired" || status === "revoked") {
          clearInterval(pollInterval);
          resolve({ success: false });
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          resolve({ success: false });
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          reject(error);
        }
      }
    }, 1000); // Poll every second

    // backoff strategy
    setTimeout(() => {
      clearInterval(pollInterval);
      resolve({ success: false });
    }, 30000); // Timeout after 30 seconds
  });
};
