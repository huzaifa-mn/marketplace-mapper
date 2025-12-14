import { prisma } from "core/config/db";
import { AppError } from "core/utils/error";
import { logger } from "core/utils/logger";
import { Request, Response, NextFunction } from "express";

/**
 * Ensures that a marketplace template with the given
 * marketplace + name combination does not already exist.
 *
 * Use on create-template route before the controller.
 */
export async function ensureUniqueMarketplace(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    try {
        const { name } = req.body as {
            // marketplace?: string;
            name?: string;
        };

        if (!name) {
            // Let your validation layer handle missing fields
            return next();
        }

        const existing = await prisma.marketplaceTemplate.findFirst({
            where: {
                name,
            },
        });

        if (existing) {
            throw new AppError(
                "A template for this marketplace with the same name already exists",
                {
                    statusCode: 409,
                    code: "CONFLICT",
                    details: { marketplace: existing, name, id: existing.id },
                },
            );
        }

        return next();
    } catch (err) {
        logger.error({ err }, "ensureUniqueMarketplace failed");
        return next(err);
    }
}
