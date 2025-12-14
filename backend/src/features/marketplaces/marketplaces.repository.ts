// marketplaces.repository.ts
import { prisma } from "../../core/config/db";

const PAGE_SIZE = 10;

export async function findAllWithPagination(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.marketplaceTemplate.findMany({
      include: { attributes: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.marketplaceTemplate.count(),
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

export async function findByIdWithAttributes(id: number) {
  return prisma.marketplaceTemplate.findUniqueOrThrow({
    where: { id },
    include: {
      attributes: true,
    },
  });
}

export async function createTemplateWithAttributes(params: {
  name: string;
  originalPath: string;
  attributeNames: string[];
}) {
  return prisma.marketplaceTemplate.create({
    data: {
      name: params.name,
      originalPath: params.originalPath,
      attributes: {
        create: params.attributeNames.map((name) => ({
          name,
          dataType: "string",
        })),
      },
    },
    include: {
      attributes: true,
    },
  });
}
