import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getFaqs, getLogs, postLeave, postMessage, upsertFaq } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Chatbot API
  app.get("/api/chat/faqs", getFaqs);
  app.post("/api/chat/faqs", upsertFaq);
  app.post("/api/chat/message", postMessage);
  app.post("/api/chat/leave", postLeave);
  app.get("/api/chat/logs", getLogs);

  return app;
}
