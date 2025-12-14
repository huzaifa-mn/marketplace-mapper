import { CreateMappingInput } from "../../shared/interfaces";
import { prisma } from "../../core/config/db";

const PAGE_SIZE = 10;

/**
 * Paginated list of mappings with basic relations for list view.
 * Used for: "Saved mappings" list page.
 */
export async function findAllWithPagination(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.mapping.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        marketplaceTemplate: true,
        sellerFile: true,
      },
    }),
    prisma.mapping.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

/**
 * Get a single mapping with full relations for detail view.
 * Includes:
 *  - marketplaceTemplate + its attributes
 *  - sellerFile
 *  - items (each item links a marketplaceAttribute to a seller column)
 */
export async function findByIdWithRelations(id: number) {
  return prisma.mapping.findUniqueOrThrow({
    where: { id },
    include: {
      marketplaceTemplate: {
        include: { attributes: true },
      },
      sellerFile: true,
      items: {
        include: {
          attribute: true, // so you can show attribute.name in UI
        },
      },
    },
  });
}

/**
 * Create a mapping and its items in one go.
 * Each item is:
 *  - marketplaceAttributeId (FK to MarketplaceAttribute)
 *  - sellerColumnName     (column name from SellerFile.columns[]).
 */
export async function createMappingWithItems(input: CreateMappingInput) {
  return prisma.mapping.create({
    data: {
      marketplaceTemplateId: input.marketplaceTemplateId,
      sellerFileId: input.sellerFileId,
      items: {
        create: input.items.map((item) => ({
          marketplaceAttributeId: item.marketplaceAttributeId,
          sellerColumnName: item.sellerColumnName,
        })),
      },
    },
    include: {
      marketplaceTemplate: true,
      sellerFile: true,
      items: true,
    },
  });
}