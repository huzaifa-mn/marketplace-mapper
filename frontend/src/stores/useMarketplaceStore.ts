// src/stores/useMarketplaceStore.ts
import { create } from "zustand";
import {
  MarketplaceTemplate,
  MarketplaceTemplateWithAttributes,
} from "../types";
import { marketplaceService } from "../services/marketplaceService";
import { getApiErrorMessage } from "@/lib/api-manager";

interface MarketplaceStore {
  templates: MarketplaceTemplate[];
  selectedTemplate: MarketplaceTemplateWithAttributes | null;
  loading: boolean;
  error: string | null;

  fetchTemplates: () => Promise<void>;
  fetchTemplateById: (id: number) => Promise<void>;
  createTemplate: (name: string, file: File) => Promise<void>;
  clearSelectedTemplate: () => void;
}

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,

  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const data = await marketplaceService.getTemplates();
      set({ templates: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  fetchTemplateById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await marketplaceService.getTemplateById(id);
      set({ selectedTemplate: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  createTemplate: async (name, file) => {
    try {
      set({ loading: true, error: null });
      const created = await marketplaceService.createTemplate({ name, file });
      set({
        templates: [...get().templates, created],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  clearSelectedTemplate: () => set({ selectedTemplate: null }),
}));
