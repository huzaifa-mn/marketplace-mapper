import { Request, Response, NextFunction } from "express";
import { Messages } from "../../core/constants/messages";
import * as service from "./seller-files.service";

/**
 * GET /api/v1/seller-files
 * Query params:
 *  - page?: number (defaults to 1)
 * Returns paginated seller files (for list page).
 */
export async function getSellerFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pageParam = req.query.page;
    const page =
      typeof pageParam === "string" ? Math.max(1, Number(pageParam) || 1) : 1;

    const files = await service.getSellerFiles(page);
    res.json(files);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/seller-files/:id
 * Returns one seller file with its stored metadata (columns, sampleRows, etc.).
 */
export async function getSellerFileById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const file = await service.getSellerFileById(id);
    res.json(file);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/seller-files
 * multipart/form-data:
 *  - file: CSV seller product file
 * Parses the file, extracts columns + sample rows, and stores a SellerFile row.
 */
export async function uploadSellerFile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: Messages.VALIDATION.FILE_REQUIRED });
    }

    const created = await service.uploadAndParseSellerFile(file);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
