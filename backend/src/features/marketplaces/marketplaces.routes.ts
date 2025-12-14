import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.middleware";
import * as controller from "./marketplaces.controller";
import { validateRequest } from "../../shared/middlewares/validate-request.middleware";
import { createMarketplaceTemplateSchema } from "./marketplaces.validators";

const router = Router();

/**
 * GET /api/v1/marketplace-templates
 * Query params:
 *  - page?: number (defaults to 1)
 * Returns paginated templates + metadata.
 */
router.get("/", controller.getTemplates);

/**
 * GET /api/v1/marketplace-templates/:id
 * Returns a single marketplace template with its attributes.
 */
router.get("/:id", controller.getTemplateById);

/**
 * POST /api/v1/marketplace-templates
 * multipart/form-data:
 *  - name: string (validated)
 *  - file: CSV file (handled by Multer)
 */
router.post(
  "/",
  upload.single("file"),
  validateRequest(createMarketplaceTemplateSchema, "body"),
  controller.createTemplate,
);

/**
 * - marketplace must be unique according to name (one name if taken can't be used again)
 * - 
 */

export default router;
