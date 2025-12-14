import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMarketplaceTemplates, useMarketplaceTemplate, useCreateMarketplaceTemplate, useGetMarketplaceTemplateById } from "../useMarketplaceHooks";
import { marketplaceService } from "../../services/marketplaceService";

jest.mock("../../services/marketplaceService");

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

const mockedMarketplaceService = marketplaceService as jest.Mocked<typeof marketplaceService>;

describe("useMarketplaceHooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("useMarketplaceTemplates", () => {
        it("fetches templates", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1, pageSize: 10 };
            mockedMarketplaceService.getTemplates.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useMarketplaceTemplates(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedMarketplaceService.getTemplates).toHaveBeenCalledWith(1);
        });
    });

    describe("useMarketplaceTemplate", () => {
        it("fetches single template", async () => {
            const mockResponse = { id: 1, name: "Test", attributes: [], createdAt: "" };
            mockedMarketplaceService.getTemplateById.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useMarketplaceTemplate(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedMarketplaceService.getTemplateById).toHaveBeenCalledWith(1);
        });
    });

    describe("useGetMarketplaceTemplateById", () => {
        it("fetches single template (duplicate hook)", async () => {
            const mockResponse = { id: 1, name: "Test", attributes: [], createdAt: "" };
            mockedMarketplaceService.getTemplateById.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useGetMarketplaceTemplateById(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedMarketplaceService.getTemplateById).toHaveBeenCalledWith(1);
        });
    });

    describe("useCreateMarketplaceTemplate", () => {
        it("creates template", async () => {
            const mockResponse = { id: 2, name: "new", attributes: [], createdAt: "" };
            mockedMarketplaceService.createTemplate.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useCreateMarketplaceTemplate(1), { wrapper: createWrapper() });

            result.current.mutate({ name: "new", file: new File([], "x.csv") });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(mockedMarketplaceService.createTemplate).toHaveBeenCalled();
        });
    });
});
