import { Command } from "commander";
import { tunnel } from "~/actions";

export const tunnelCommands = new Command("tunnel").description(
  "tunnel to localhost"
);

tunnelCommands
  .command("start")
  .argument("<port>", "Local port to tunnel")
  .option("-d, --domain <domain>", "Custom domain")
  .option("-s, --subdomain <subdomain>", "Preferred subdomain")
  .action(
    async (port: string, options: { domain?: string; subdomain?: string }) => {
      console.log(options);
      try {
        const client = new tunnel.Create({
          localPort: parseInt(port),
        });

        const { tunnel: tunnelDoc } = await client.connect();
        console.log(JSON.stringify(tunnelDoc, null, 2));
      } catch (error) {
        console.error(error);
      }
    }
  );
