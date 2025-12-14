// src/stores/useMappingStore.ts
import { create } from "zustand";
import { Mapping, MappingWithItems } from "../types";
import { mappingService, CreateMappingInput } from "../services/mappingService";
import { getApiErrorMessage } from "@/lib/api-manager";


interface MappingStore {
  mappings: Mapping[];
  selectedMapping: MappingWithItems | null;
  loading: boolean;
  error: string | null;

  fetchMappings: () => Promise<void>;
  fetchMappingById: (id: number) => Promise<void>;
  createMapping: (payload: CreateMappingInput) => Promise<void>;
  clearSelectedMapping: () => void;
}

export const useMappingStore = create<MappingStore>((set, get) => ({
  mappings: [],
  selectedMapping: null,
  loading: false,
  error: null,

  fetchMappings: async () => {
    try {
      set({ loading: true, error: null });
      const data = await mappingService.getMappings();
      set({ mappings: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  fetchMappingById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await mappingService.getMappingById(id);
      set({ selectedMapping: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  createMapping: async (payload) => {
    try {
      set({ loading: true, error: null });
      const created = await mappingService.createMapping(payload);
      set({
        mappings: [...get().mappings, created],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  clearSelectedMapping: () => set({ selectedMapping: null }),
}));
