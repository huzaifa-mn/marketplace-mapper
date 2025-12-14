// src/services/sellerFileService.ts

import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { SellerFile } from "../types";
import { apiGet, apiPostFormData } from "@/lib/api-manager";
import { PaginatedResponse } from "./marketplaceService";

export const sellerFileService = {
  getSellerFiles: async (
    page: number = 1
  ): Promise<PaginatedResponse<SellerFile>> => {
    return apiGet<PaginatedResponse<SellerFile>>(
      `${API_ENDPOINTS.SELLER_FILES}?page=${page}`
    );
  },

  getSellerFileById: (id: number): Promise<SellerFile> => {
    return apiGet<SellerFile>(`${API_ENDPOINTS.SELLER_FILES}/${id}`);
  },

  uploadSellerFile: (file: File): Promise<SellerFile> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiPostFormData<SellerFile>(API_ENDPOINTS.SELLER_FILES, formData);
  },
};
