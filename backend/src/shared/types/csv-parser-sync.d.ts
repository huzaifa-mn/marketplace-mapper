declare module "csv-parse/sync" {
  export interface CsvParseOptions {
    columns?: boolean;
    skip_empty_lines?: boolean;
    [key: string]: any;
  }

  export function parse<T = any>(
    input: string | Buffer,
    options?: CsvParseOptions
  ): T[];
}
