// src/stores/useSellerFileStore.ts
import { create } from "zustand";
import { SellerFile } from "../types";
import { sellerFileService } from "../services/sellerFileService";
import { getApiErrorMessage } from "@/lib/api-manager";

interface SellerFileStore {
  sellerFiles: SellerFile[];
  selectedSellerFile: SellerFile | null;
  loading: boolean;
  error: string | null;

  fetchSellerFiles: () => Promise<void>;
  fetchSellerFileById: (id: number) => Promise<void>;
  uploadSellerFile: (file: File) => Promise<void>;
  clearSelectedSellerFile: () => void;
}

export const useSellerFileStore = create<SellerFileStore>((set, get) => ({
  sellerFiles: [],
  selectedSellerFile: null,
  loading: false,
  error: null,

  fetchSellerFiles: async () => {
    try {
      set({ loading: true, error: null });
      const data = await sellerFileService.getSellerFiles();
      set({ sellerFiles: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  fetchSellerFileById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await sellerFileService.getSellerFileById(id);
      set({ selectedSellerFile: data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  uploadSellerFile: async (file: File) => {
    try {
      set({ loading: true, error: null });
      const created = await sellerFileService.uploadSellerFile(file);
      set({
        sellerFiles: [...get().sellerFiles, created],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: getApiErrorMessage(error),
      });
    }
  },

  clearSelectedSellerFile: () => set({ selectedSellerFile: null }),
}));
