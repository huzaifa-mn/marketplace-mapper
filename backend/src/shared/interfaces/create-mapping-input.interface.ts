export interface CreateMappingInput {
    marketplaceTemplateId: number;
    sellerFileId: number;
    items: CreateMappingItemInput[];
}

export interface CreateMappingItemInput {
    marketplaceAttributeId: number;
    sellerColumnName: string;
}