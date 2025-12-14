// src/query/marketplaceHooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MarketplaceTemplate,
  MarketplaceTemplateWithAttributes,
} from "../types";
import {
  marketplaceService,
  PaginatedResponse,
} from "../services/marketplaceService";

import type { CreateMarketplaceTemplatePayload } from "../services/marketplaceService";
import { marketplaceKeys } from "@/lib/queryKeys";

export const useMarketplaceTemplates = (page: number = 1) => {
  return useQuery<PaginatedResponse<MarketplaceTemplate>>({
    queryKey: marketplaceKeys.list(page),
    queryFn: () => marketplaceService.getTemplates(page),
  });
};

export const useMarketplaceTemplate = (id: number | null) => {
  return useQuery<MarketplaceTemplateWithAttributes>({
    queryKey: id ? marketplaceKeys.detail(id) : marketplaceKeys.detail(0),
    queryFn: () => {
      if (!id) throw new Error("Marketplace template id is required");
      return marketplaceService.getTemplateById(id);
    },
    enabled: !!id,
  });
};

export const useCreateMarketplaceTemplate = (page: number = 1) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarketplaceTemplatePayload) =>
      marketplaceService.createTemplate(payload),
    onSuccess: () => {
      // refetch list
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.list(page), exact: false, });
    },
  });
};

export function useGetMarketplaceTemplateById(id: number) {
  return useQuery({
    queryKey: ["marketplace-template", id],
    queryFn: () => marketplaceService.getTemplateById(id),
    enabled: !!id,
  });
}

