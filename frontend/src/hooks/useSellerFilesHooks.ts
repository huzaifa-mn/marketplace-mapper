import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SellerFile } from "../types";
import { sellerFileService } from "../services/sellerFileService";
import { PaginatedResponse } from "../services/marketplaceService";
import { sellerFileKeys } from "@/lib/queryKeys";

export const useSellerFiles = (page: number = 1) => {
  return useQuery<PaginatedResponse<SellerFile>>({
    queryKey: sellerFileKeys.list(page),
    queryFn: () => sellerFileService.getSellerFiles(page),
  });
};

export const useSellerFile = (id: number | null) => {
  return useQuery<SellerFile>({
    queryKey: id ? sellerFileKeys.detail(id) : sellerFileKeys.detail(0),
    queryFn: () => {
      if (!id) throw new Error("Seller file id is required");
      return sellerFileService.getSellerFileById(id);
    },
    enabled: !!id,
  });
};

export const useUploadSellerFile = (page: number = 1) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => sellerFileService.uploadSellerFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerFileKeys.list(page), exact: false, });
    },
  });
};
