export interface MarketplaceAttribute {
  id: number;
  marketplaceTemplateId: number;
  name: string;       // e.g. "productName", "brand", "images"
  dataType?: string;  // optional (string | number | boolean | image)
}
