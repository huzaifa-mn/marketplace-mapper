import { MarketplaceTemplateDTO } from "./marketplace.interface";
import { SellerFileDTO } from "./seller-file.interface";

export interface MappingDTO {
  id: number;
  marketplaceTemplateId: number;
  sellerFileId: number;
  createdAt: string;
}

export interface MappingItemDTO {
  id: number;
  mappingId: number;
  marketplaceAttributeId: number;
  sellerColumnName: string;
}

export interface MappingWithItemsDTO extends MappingDTO {
  marketplaceTemplate: MarketplaceTemplateDTO;
  sellerFile: SellerFileDTO;
  items: MappingItemDTO[];
}
