import path from "path";
import { parseCsvFile } from "../../core/helpers/csv-parse";
import { parseExcelFile } from "../../core/helpers/excel-parse";
import * as repo from "./seller-files.repository";

/**
 * Paginated list of seller files for list page.
 */
export async function getSellerFiles(page: number) {
  return repo.findAllWithPagination(page);
}

/**
 * Get a single seller file by id.
 */
export async function getSellerFileById(id: number) {
  return repo.findById(id);
}

/**
 * Upload and parse a seller CSV file, then persist metadata.
 * Stores:
 *  - fileName
 *  - storedPath
 *  - columns[]
 *  - sampleRows (first few rows)
 */
export async function uploadAndParseSellerFile(file: Express.Multer.File) {
  const ext = path.extname(file.originalname).toLowerCase();

  let result;
  if (ext === ".csv") {
    result = await parseCsvFile(file.path);
  } else if (ext === ".xlsx" || ext === ".xls") {
    result = await parseExcelFile(file.path);
  } else {
    // Fallback or error - middleware should catch this but safety check
    throw new Error("Unsupported file extension");
  }

  const { columns, sampleRows } = result;

  return repo.create({
    fileName: file.originalname,
    storedPath: file.path,
    columns,
    sampleRows,
  });
}
