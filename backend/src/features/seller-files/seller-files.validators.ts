import { z } from "zod";

/**
 * Validation for uploading a seller product CSV.
 * Currently supports optional metadata like sellerName.
 */
export const uploadSellerFileSchema = z.object({
  // Optional, but if provided, must be a non-empty string after trim.
  sellerName: z
    .string()
    .trim()
    .min(1, "sellerName cannot be empty")
    .optional(),
});
