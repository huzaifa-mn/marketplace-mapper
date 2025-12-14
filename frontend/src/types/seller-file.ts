export interface SellerFile {
  id: number;
  fileName: string;
  originalFilePath?: string;
  columns: string[];         // e.g. ["SKU", "Name", "BrandName", "Image1", ...]
  sampleRows: Record<string, any>[]; // array of sample objects
  createdAt: string;
}
