import * as XLSX from "xlsx";
import { ParsedSellerFile } from "./csv-parse"; // Reuse interface
import { Messages } from "../constants/messages";

/**
 * Normalize a header cell:
 * - trim whitespace
 * - remove leading/trailing double quotes if present (less common in Excel but good for consistency)
 */
function normalizeHeader(value: string | undefined): string {
    if (!value) return "";
    const trimmed = String(value).trim();
    return trimmed.replace(/^"(.*)"$/, "$1");
}

/**
 * Parse Excel seller product file.
 */
export async function parseExcelFile(
    filePath: string,
): Promise<ParsedSellerFile> {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON (array of arrays) to easily get headers and data
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1, // 1 means array of arrays
            blankrows: false,
            defval: "",
        });

        if (rows.length === 0) {
            return { columns: [], sampleRows: [], totalRows: 0 };
        }

        // First row is headers
        const headerRow = rows[0];
        const dataRows = rows.slice(1);

        const columns = headerRow
            .map((h: any) => normalizeHeader(h))
            .filter((h: string) => h.length > 0);

        if (columns.length === 0) {
            throw new Error(Messages.VALIDATION.NO_COLUMNS);
        }

        // Map data rows to objects
        const records = dataRows.map((r: any[]) => {
            const obj: Record<string, any> = {};
            columns.forEach((col, idx) => {
                obj[col] = r[idx] ?? "";
            });
            return obj;
        });

        if (records.length === 0) {
            // It's possible to have headers but no data
            return { columns, sampleRows: [], totalRows: 0 };
        }

        return {
            columns,
            sampleRows: records.slice(0, 5),
            totalRows: records.length,
        };
    } catch (error) {
        throw new Error(
            `${Messages.VALIDATION.PARSE_ERROR}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
    }
}
