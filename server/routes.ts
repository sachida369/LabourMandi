import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(_httpServer: Server, app: Express) {

  // Example API route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // EXAMPLE: Get all workers
  app.get("/api/workers", async (_req, res) => {
    const workers = await storage.listWorkers();
    res.json(workers);
  });

  // EXAMPLE: Create worker
  app.post("/api/workers", async (req, res) => {
    const created = await storage.createWorker(req.body);
    res.json(created);
  });

  // Add your other API routes below ↓
  // app.get("/api/...")

}
