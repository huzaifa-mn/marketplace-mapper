import { Router } from "express";
import * as controller from "./mappings.controller";
import { validateRequest } from "../../shared/middlewares/validate-request.middleware";
import { createMappingSchema } from "./mappings.validators";

const router = Router();

/**
 * GET /api/v1/mappings
 * Query params:
 *  - page?: number (defaults to 1)
 * Returns paginated saved mappings.
 */
router.get("/", controller.getMappings);

/**
 * GET /api/v1/mappings/:id
 * Returns a single mapping with:
 *  - marketplaceTemplate + attributes
 *  - sellerFile
 *  - items (each links marketplaceAttribute -> sellerColumnName)
 */
router.get("/:id", controller.getMappingById);

/**
 * POST /api/v1/mappings
 * JSON body validated by createMappingSchema.
 * Creates a mapping between a marketplace template and a seller file.
 */
router.post("/", validateRequest(createMappingSchema, "body"), controller.createMapping);

export default router;
