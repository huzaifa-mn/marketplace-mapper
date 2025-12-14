// // src/services/marketplaceService.ts

// import { apiGet, apiPostFormData } from "@/lib/api-manager";
// import {
//   MarketplaceTemplate,
//   MarketplaceTemplateWithAttributes,
// } from "../types";
// import { API_ENDPOINTS } from "@/lib/api-endpoints";

// export interface CreateMarketplaceTemplatePayload {
//   name: string;
//   file: File;
// }

// export const marketplaceService = {
//   getTemplates: (): Promise<MarketplaceTemplate[]> => {
//     return apiGet<MarketplaceTemplate[]>(API_ENDPOINTS.MARKETPLACE_TEMPLATES);
//   },

//   getTemplateById: (id: number): Promise<MarketplaceTemplateWithAttributes> => {
//     return apiGet<MarketplaceTemplateWithAttributes>(
//       `${API_ENDPOINTS.MARKETPLACE_TEMPLATES}/${id}`
//     );
//   },

//   createTemplate: (
//     payload: CreateMarketplaceTemplatePayload
//   ): Promise<MarketplaceTemplate> => {
//     const formData = new FormData();
//     formData.append("name", payload.name);
//     formData.append("file", payload.file);

//     console.log("Creating template with payload:", JSON.stringify(payload));

//     return apiPostFormData<MarketplaceTemplate>(
//       API_ENDPOINTS.MARKETPLACE_TEMPLATES,
//       formData
//     );
//   },
// };

// src/services/marketplaceService.ts
import { apiGet, apiPostFormData } from "@/lib/api-manager";
import {
  MarketplaceTemplate,
  MarketplaceTemplateWithAttributes,
} from "../types";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface CreateMarketplaceTemplatePayload {
  name: string;
  file: File;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const marketplaceService = {
  getTemplates: async (
    page: number = 1
  ): Promise<PaginatedResponse<MarketplaceTemplate>> => {
    return apiGet<PaginatedResponse<MarketplaceTemplate>>(
      `${API_ENDPOINTS.MARKETPLACE_TEMPLATES}?page=${page}`
    );
  },

  getTemplateById: (id: number): Promise<MarketplaceTemplateWithAttributes> => {
    return apiGet<MarketplaceTemplateWithAttributes>(
      `${API_ENDPOINTS.MARKETPLACE_TEMPLATES}/${id}`
    );
  },

  createTemplate: (
    payload: CreateMarketplaceTemplatePayload
  ): Promise<MarketplaceTemplate> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("file", payload.file); // field name must be "file" to match upload.single("file")

    return apiPostFormData<MarketplaceTemplate>(
      API_ENDPOINTS.MARKETPLACE_TEMPLATES,
      formData
    );
  },
};
