import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupSwagger } from "./core/config/swagger";
import marketplacesRoutes from "./features/marketplaces/marketplaces.routes";
import mappingsRoutes from "./features/mappings/mappings.routes";
import sellerFilesRoutes from "./features/seller-files/seller-files.routes";

/**
 * Express application instance
 * This is the core of our backend, handling all API requests.
 */
const app = express();

// ============================================================================
// Middleware Configuration
// ============================================================================
// Parse JSON request bodies (essential for handling JSON payloads)
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
// This strictly allows requests specifically from our frontend URL.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies/headers if needed in future
  })
);

// ============================================================================
// API Documentation
// ============================================================================
// Initialize Swagger UI at /api/docs so developers can explore endpoints easily
setupSwagger(app);

// ============================================================================
// Route Registration
// ============================================================================
// We organize routes by "feature" (vertical slices) for better scalability
app.use("/api/v1/marketplace-templates", marketplacesRoutes);
app.use("/api/v1/mappings", mappingsRoutes);
app.use("/api/v1/seller-files", sellerFilesRoutes);

// ============================================================================
// Global Error Handling
// ============================================================================
// Catches any unhandled errors and returns a standardized JSON response
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error:", err); // Log the error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    code: err.code || "INTERNAL_ERROR",
    message,
  });
});

// ============================================================================
// Health Checks
// ============================================================================
// Simple endpoint to verify the API is up and running
app.get("/api", (req, res) => {
  res.json({
    message: "Marketplace Mapper API",
    version: "1.0.0",
    docs: "/api/docs",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // console.log(`📚 Documentation available at http://localhost:${PORT}/api/docs`);
});

export default app;
