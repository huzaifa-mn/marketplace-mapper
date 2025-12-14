export const marketplaceKeys = {
  all: ["marketplace-templates"] as const,
  list: (page?: number) => [...marketplaceKeys.all, "list", page] as const,
  detail: (id: number) => [...marketplaceKeys.all, "detail", id] as const,
};

export const sellerFileKeys = {
  all: ["seller-files"] as const,
  list: (page?: number) => [...sellerFileKeys.all, "list", page] as const,
  detail: (id: number) => [...sellerFileKeys.all, "detail", id] as const,
};

export const mappingKeys = {
  all: ["mappings"] as const,
  list: (page?: number) => [...mappingKeys.all, "list", page] as const,
  detail: (id: number) => [...mappingKeys.all, "detail", id] as const,
};
