import { CopilotClient, type ModelInfo } from "@github/copilot-sdk";

let sharedClient: CopilotClient | null = null;
let startPromise: Promise<void> | null = null;

/**
 * Returns a shared CopilotClient instance, starting it on first use.
 * The GitHub token is read from the GITHUB_TOKEN, COPILOT_GITHUB_TOKEN,
 * or GH_TOKEN environment variables in that order.
 */
export async function getClient(): Promise<CopilotClient> {
  if (!sharedClient) {
    const githubToken =
      process.env["COPILOT_GITHUB_TOKEN"] ??
      process.env["GITHUB_TOKEN"] ??
      process.env["GH_TOKEN"];

    sharedClient = new CopilotClient({
      githubToken,
      autoRestart: true,
    });
  }

  if (!startPromise) {
    startPromise = sharedClient.start();
  }
  await startPromise;

  return sharedClient;
}

/**
 * Fetch all available Copilot models.
 */
export async function listModels(): Promise<ModelInfo[]> {
  const client = await getClient();
  return client.listModels();
}

/**
 * Shut down the shared client on process exit.
 */
export async function shutdown(): Promise<void> {
  if (sharedClient) {
    await sharedClient.stop();
    sharedClient = null;
    startPromise = null;
  }
}
