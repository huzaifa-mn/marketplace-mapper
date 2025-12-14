import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import { Messages } from "../constants/messages";

export interface ParsedSellerFile {
  columns: string[];
  sampleRows: Record<string, any>[];
  totalRows: number;
}

export interface ParsedTemplateDetails {
  attributes: string[];
  sampleData: Record<string, any>[];
}

export interface TemplateAttribute {
  name: string;
  type?: string;
  required?: boolean;
}

/**
 * Normalize a CSV header cell:
 * - trim whitespace
 * - remove leading/trailing double quotes if present
 */
function normalizeHeader(value: string): string {
  const trimmed = value.trim();
  return trimmed.replace(/^"(.*)"$/, "$1");
}

const normalizeAttrName = (value: string) => {
  const trimmed = value.trim();
  return trimmed.replace(/^"(.*)"$/, "$1");
};

/**
 * Internal helper: read file and split into non‑empty lines.
 */
async function readCsvLines(filePath: string): Promise<string[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
}

/**
 * Parse seller product CSV file.
 */
export async function parseCsvFile(
  filePath: string,
): Promise<ParsedSellerFile> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");

    const rows: string[][] = parse(raw, {
      columns: false,
      skip_empty_lines: true,
      trim: true,
    });

    if (rows.length === 0) {
      return { columns: [], sampleRows: [], totalRows: 0 };
    }

    const headerRow = rows[0];
    const dataRows = rows.slice(1);

    const columns = headerRow
      .map((h) => normalizeHeader(h))
      .filter((h) => h.length > 0);

    const records = dataRows.map((r) => {
      const obj: Record<string, any> = {};
      columns.forEach((col, idx) => {
        obj[col] = r[idx] ?? "";
      });
      return obj;
    });

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

/**
 * Parse marketplace template CSV header into separate attribute names.
 * Leading/trailing quotes are removed from each attribute.
 */
export async function parseTemplateAttributes(
  filePath: string,
): Promise<string[]> {
  try {
    const lines = await readCsvLines(filePath);

    if (lines.length === 0) {
      return [];
    }

    const headerLine = lines[0];

    const attributes = headerLine
      .split(",")
      .map((h) => normalizeAttrName(h))
      .filter((h) => h.length > 0);

    return attributes;
  } catch (error) {
    throw new Error(
      `${Messages.VALIDATION.TEMPLATE_PARSE_ERROR}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validate CSV file format before processing.
 */
export async function validateCsvFile(filePath: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const lines = await readCsvLines(filePath);

    if (lines.length === 0) {
      return { isValid: false, error: Messages.VALIDATION.FILE_EMPTY };
    }

    const headerLine = lines[0];
    const dataPart = lines.slice(1).join("\n");

    const headerColumns = headerLine
      .split(",")
      .map((h) => normalizeHeader(h))
      .filter((h) => h.length > 0);

    if (headerColumns.length === 0) {
      return { isValid: false, error: Messages.VALIDATION.NO_COLUMNS };
    }

    const records = parse(dataPart, {
      columns: headerColumns as any,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, any>[];

    if (records.length === 0) {
      return { isValid: false, error: Messages.VALIDATION.NO_DATA };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `${Messages.VALIDATION.INVALID_CSV}: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Get detailed template information including sample data.
 * Attribute names are normalized (quotes stripped).
 */
export async function parseTemplateWithDetails(
  filePath: string,
): Promise<ParsedTemplateDetails> {
  try {
    const lines = await readCsvLines(filePath);

    if (lines.length === 0) {
      return { attributes: [], sampleData: [] };
    }

    const headerLine = lines[0];
    const dataPart = lines.slice(1).join("\n");

    const attributes = headerLine
      .split(",")
      .map((h) => normalizeAttrName(h))
      .filter((h) => h.length > 0);

    if (attributes.length === 0) {
      throw new Error(Messages.VALIDATION.NO_ATTRIBUTES);
    }

    const records: Record<string, any>[] = parse(dataPart, {
      columns: attributes as any,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    const sampleData = records.slice(0, 1);

    return { attributes, sampleData };
  } catch (error) {
    throw new Error(
      `${Messages.VALIDATION.TEMPLATE_PARSE_ERROR}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
