import { MarketplaceAttribute } from "./marketplace-attribute";

export interface MarketplaceTemplate {
  id: number;
  name: string; // e.g. "Myntra", "Amazon"
  originalFilePath?: string; // optional if you stored uploaded CSV
  createdAt: string;

  attributes: MarketplaceAttribute[];
}
