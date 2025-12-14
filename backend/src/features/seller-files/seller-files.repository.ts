import { prisma } from "../../core/config/db";

const PAGE_SIZE = 10;

/**
 * Paginated list of seller files for the list page.
 */
export async function findAllWithPagination(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  const [items, total] = await Promise.all([
    prisma.sellerFile.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.sellerFile.count(),
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
 * Get a single seller file by id.
 * Includes columns and sampleRows stored at upload time.
 */
export async function findById(id: number) {
  return prisma.sellerFile.findUniqueOrThrow({
    where: { id },
  });
}

/**
 * Create a SellerFile entry after parsing the CSV.
 */
export async function create(data: {
  fileName: string;
  storedPath: string;
  columns: string[];
  sampleRows: any[];
}) {
  return prisma.sellerFile.create({
    data: {
      fileName: data.fileName,
      storedPath: data.storedPath,
      columns: data.columns,
      sampleRows: data.sampleRows,
    },
  });
}
