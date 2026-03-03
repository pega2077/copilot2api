import { createApp } from "./server.js";
import { shutdown } from "./copilot.js";

const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`copilotsdk2api listening on http://localhost:${PORT}`);
  console.log(`  GET  /v1/models`);
  console.log(`  POST /v1/chat/completions`);
});

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\nReceived ${signal}, shutting down...`);
  server.close(() => {
    shutdown()
      .catch(console.error)
      .finally(() => process.exit(0));
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
