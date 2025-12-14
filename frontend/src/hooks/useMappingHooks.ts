import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mapping, MappingWithItems } from "../types";
import { mappingService } from "../services/mappingService";
import { PaginatedResponse } from "../services/marketplaceService";
import { mappingKeys } from "@/lib/queryKeys";
import type { CreateMappingInput } from "../services/mappingService";

export const useMappings = (page: number = 1) => {
  return useQuery<PaginatedResponse<Mapping>>({
    queryKey: mappingKeys.list(page),
    queryFn: () => mappingService.getMappings(page),
  });
};

export const useMapping = (id: number | null) => {
  return useQuery<MappingWithItems>({
    queryKey: id ? mappingKeys.detail(id) : mappingKeys.detail(0),
    queryFn: () => {
      if (!id) throw new Error("Mapping id is required");
      return mappingService.getMappingById(id);
    },
    enabled: !!id,
  });
};

export const useCreateMapping = (page: number = 1) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMappingInput) =>
      mappingService.createMapping(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mappingKeys.list(page), exact: false, });
    },
  });
};
