import { MarketplaceAttribute } from "./marketplace-attribute";
import { MarketplaceTemplate } from "./marketplace-template";

export interface MarketplaceTemplateWithAttributes
  extends MarketplaceTemplate {
  attributes: MarketplaceAttribute[];
}
