import express from "express";
import { chatCompletionsHandler } from "./routes/chat.js";
import { modelsHandler } from "./routes/models.js";

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // OpenAI-compatible routes
  app.get("/v1/models", modelsHandler);
  app.post("/v1/chat/completions", chatCompletionsHandler);

  return app;
}
