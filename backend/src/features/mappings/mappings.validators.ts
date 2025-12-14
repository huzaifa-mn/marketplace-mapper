import { z } from "zod";

/**
 * Validation for creating a mapping between:
 *  - one marketplace template
 *  - one seller file
 *  - one or more (target attribute -> source column) items
 *
 * Note: using z.coerce.number() so IDs can come as strings from JSON.
 * Using only `message` because your typings complain about required_error.
 */
export const createMappingSchema = z.object({
  marketplaceTemplateId: z.coerce
    .number({
      message: "marketplaceTemplateId must be a number",
    })
    .int("marketplaceTemplateId must be an integer")
    .positive("marketplaceTemplateId must be positive"),

  sellerFileId: z.coerce
    .number({
      message: "sellerFileId must be a number",
    })
    .int("sellerFileId must be an integer")
    .positive("sellerFileId must be positive"),

  items: z
    .array(
      z.object({
        marketplaceAttributeId: z.coerce
          .number({
            message: "marketplaceAttributeId must be a number",
          })
          .int("marketplaceAttributeId must be an integer")
          .positive("marketplaceAttributeId must be positive"),
        sellerColumnName: z
          .string({
            message: "sellerColumnName must be a string",
          })
          .trim()
          .min(1, "sellerColumnName is required and cannot be empty"),
      }),
    )
    .min(1, "At least one mapping item is required"),
});
