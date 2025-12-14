import { Mapping } from "./mapping";
import { MappingItem } from "./mapping-item";
import { MarketplaceTemplate } from "./marketplace-template";
import { SellerFile } from "./seller-file";

export interface MappingWithItems extends Mapping {
  marketplaceTemplate: MarketplaceTemplate;
  sellerFile: SellerFile;
  items: MappingItem[];
}
