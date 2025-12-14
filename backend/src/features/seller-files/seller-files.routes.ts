import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.middleware";
import * as controller from "./seller-files.controller";

const router = Router();

/**
 * GET /api/v1/seller-files
 * Query params:
 *  - page?: number (defaults to 1)
 * Returns paginated seller files.
 */
router.get("/", controller.getSellerFiles);

/**
 * GET /api/v1/seller-files/:id
 * Returns a single seller file with its stored columns and sampleRows.
 */
router.get("/:id", controller.getSellerFileById);

/**
 * POST /api/v1/seller-files
 * multipart/form-data:
 *  - file: CSV seller product file (required)
 *  - sellerName?: string (optional metadata, if you enable validation)
 */
router.post(
    "/",
    upload.single("file"),
    // enable when you start sending metadata:
    // validateRequest(uploadSellerFileSchema, "body"),
    controller.uploadSellerFile,
);

export default router;
