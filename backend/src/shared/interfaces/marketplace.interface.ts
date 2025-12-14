export interface MarketplaceTemplateDTO {
  id: number;
  name: string;
  originalPath?: string | null;
  createdAt: string;
  attributes: MarketplaceAttributeDTO[];
}

export interface MarketplaceAttributeDTO {
  id: number;
  marketplaceTemplateId: number;
  name: string;
  dataType?: string | null;
}
