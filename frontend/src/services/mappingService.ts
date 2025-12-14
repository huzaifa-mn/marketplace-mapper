// src/services/mappingService.ts

import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { apiGet, apiPostJson } from "@/lib/api-manager";
import { Mapping, MappingWithItems } from "../types";
import { PaginatedResponse } from "./marketplaceService";

export interface CreateMappingItemInput {
  marketplaceAttributeId: number;
  sellerColumnName: string;
}

export interface CreateMappingInput {
  marketplaceTemplateId: number;
  sellerFileId: number;
  items: CreateMappingItemInput[];
}

export const mappingService = {
  getMappings: async (
    page: number = 1
  ): Promise<PaginatedResponse<Mapping>> => {
    return apiGet<PaginatedResponse<Mapping>>(
      `${API_ENDPOINTS.MAPPINGS}?page=${page}`
    );
  },

  getMappingById: (id: number): Promise<MappingWithItems> => {
    return apiGet<MappingWithItems>(`${API_ENDPOINTS.MAPPINGS}/${id}`);
  },

  createMapping: (payload: CreateMappingInput): Promise<Mapping> => {
    return apiPostJson<Mapping, CreateMappingInput>(
      API_ENDPOINTS.MAPPINGS,
      payload
    );
  },
};
