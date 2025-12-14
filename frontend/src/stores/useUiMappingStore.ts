// useMappingUiStore.ts
import { create } from "zustand";

interface MappingUiStore {
  selectedMarketplaceTemplateId: number | null;
  selectedSellerFileId: number | null;

  // key: marketplaceAttributeId, value: sellerColumnName
  attributeMappings: Record<number, string | null>;

  setSelectedMarketplaceTemplateId: (id: number | null) => void;
  setSelectedSellerFileId: (id: number | null) => void;

  setAttributeMapping: (attributeId: number, sellerColumnName: string | null) => void;
  resetMappings: () => void;

  // convenience selector
  isColumnAlreadyMapped: (sellerColumnName: string) => boolean;
}

export const useMappingUiStore = create<MappingUiStore>((set, get) => ({
  selectedMarketplaceTemplateId: null,
  selectedSellerFileId: null,
  attributeMappings: {},

  setSelectedMarketplaceTemplateId: (id) =>
    set({
      selectedMarketplaceTemplateId: id,
      attributeMappings: {}, // reset when marketplace changes
    }),

  setSelectedSellerFileId: (id) =>
    set({
      selectedSellerFileId: id,
      attributeMappings: {}, // reset when seller file changes
    }),

  setAttributeMapping: (attributeId, sellerColumnName) =>
    set((state) => ({
      attributeMappings: {
        ...state.attributeMappings,
        [attributeId]: sellerColumnName,
      },
    })),

  resetMappings: () =>
    set({
      attributeMappings: {},
      selectedMarketplaceTemplateId: null,
      selectedSellerFileId: null,
    }),

  isColumnAlreadyMapped: (sellerColumnName: string) => {
    const { attributeMappings } = get();
    return Object.values(attributeMappings).includes(sellerColumnName);
  },
}));
