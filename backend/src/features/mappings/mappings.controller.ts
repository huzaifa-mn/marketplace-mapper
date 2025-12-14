
import { Request, Response, NextFunction } from "express";
import * as service from "./mappings.service";

/**
 * GET /api/v1/mappings
 * Query params:
 *  - page?: number (defaults to 1)
 * Returns paginated mappings for the "Saved mappings" list page.
 */
export async function getMappings(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pageParam = req.query.page;
    const page =
      typeof pageParam === "string" ? Math.max(1, Number(pageParam) || 1) : 1;

    const mappings = await service.getMappings(page);
    res.json(mappings);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/mappings/:id
 * Returns a single mapping with:
 *  - marketplaceTemplate + attributes
 *  - sellerFile
 *  - items (each item links a marketplaceAttribute to a seller column)
 */
export async function getMappingById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const mapping = await service.getMappingById(id);
    res.json(mapping);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/mappings
 * JSON body (example):
 * {
 *   "marketplaceTemplateId": 1,
 *   "sellerFileId": 2,
 *   "items": [
 *     { "marketplaceAttributeId": 10, "sellerColumnName": "Name" },
 *     { "marketplaceAttributeId": 11, "sellerColumnName": "BrandName" }
 *   ]
 * }
 */
export async function createMapping(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const created = await service.createMapping(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
