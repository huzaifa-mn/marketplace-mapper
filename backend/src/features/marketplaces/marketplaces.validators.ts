import { z } from "zod";

/**
 * Validation for creating a marketplace template.
 *
 * Used for:
 * - POST /marketplaces/templates
 * Body fields (multipart/form-data alongside file):
 *  - name: human-friendly template name, required, max 100 chars
 */

export const createMarketplaceTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "name cannot be empty")
    .max(100, "name too long"),
});

// In your controller/middleware you can use:
// const parsed = createMarketplaceTemplateSchema.parse(req.body);
