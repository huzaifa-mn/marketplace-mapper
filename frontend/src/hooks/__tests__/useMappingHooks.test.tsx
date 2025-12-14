import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMappings, useMapping, useCreateMapping } from "../useMappingHooks";
import { mappingService } from "../../services/mappingService";

jest.mock("../../services/mappingService");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

const mockedMappingService = mappingService as jest.Mocked<typeof mappingService>;

describe("useMappingHooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("useMappings", () => {
        it("fetches mappings", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1, pageSize: 10 };
            mockedMappingService.getMappings.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useMappings(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedMappingService.getMappings).toHaveBeenCalledWith(1);
        });
    });

    describe("useMapping", () => {
        it("fetches single mapping", async () => {
            const mockResponse = {
                id: 1,
                createdAt: "",
                marketplaceTemplateId: 1,
                sellerFileId: 1,
                items: [],
                marketplaceTemplate: { id: 1, name: "A", createdAt: "", attributes: [] },
                sellerFile: { id: 1, fileName: "B", createdAt: "", columns: [], sampleRows: [] },
            };
            mockedMappingService.getMappingById.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useMapping(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedMappingService.getMappingById).toHaveBeenCalledWith(1);
        });
    });

    describe("useCreateMapping", () => {
        it("creates mapping", async () => {
            const mockResponse = {
                id: 2,
                createdAt: "",
                marketplaceTemplateId: 1,
                sellerFileId: 2
            };
            mockedMappingService.createMapping.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useCreateMapping(1), { wrapper: createWrapper() });

            result.current.mutate({ marketplaceTemplateId: 1, sellerFileId: 2, items: [] });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(mockedMappingService.createMapping).toHaveBeenCalled();
        });
    });
});
