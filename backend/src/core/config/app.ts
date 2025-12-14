import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorHandler } from "../../shared/middlewares/error-handler.middleware";
import { notFoundHandler } from "../../shared/middlewares/not-found.middleware";

export function createApp() {
  const app = express();

  // Basic security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // easier for dev / APIs
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS
  app.use(cors());

  // Limit JSON & URL-encoded payload sizes (e.g. 1MB)
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // API routes
  app.use("/api/v1", routes);

  // 404 + Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
