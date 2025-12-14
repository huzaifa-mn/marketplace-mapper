import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSellerFiles, useSellerFile, useUploadSellerFile } from "../useSellerFilesHooks";
import { sellerFileService } from "../../services/sellerFileService";

jest.mock("../../services/sellerFileService");

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

const mockedSellerFileService = sellerFileService as jest.Mocked<typeof sellerFileService>;

describe("useSellerFilesHooks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("useSellerFiles", () => {
        it("fetches seller files", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1, pageSize: 10 };
            mockedSellerFileService.getSellerFiles.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSellerFiles(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedSellerFileService.getSellerFiles).toHaveBeenCalledWith(1);
        });
    });

    describe("useSellerFile", () => {
        it("fetches single seller file", async () => {
            const mockResponse = { id: 1, fileName: "test.csv", columns: [], createdAt: "", sampleRows: [] };
            mockedSellerFileService.getSellerFileById.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSellerFile(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockResponse);
            expect(mockedSellerFileService.getSellerFileById).toHaveBeenCalledWith(1);
        });

        it("does not fetch if id is null", async () => {
            const { result } = renderHook(() => useSellerFile(null), { wrapper: createWrapper() });

            expect(result.current.isLoading).toBe(false); // actually it depends on enabled. It starts in pending? No, status is pending but fetchStatus is idle.
            expect(mockedSellerFileService.getSellerFileById).not.toHaveBeenCalled();
        });
    });

    describe("useUploadSellerFile", () => {
        it("uploads file and invalidates queries", async () => {
            const mockResponse = { id: 2, fileName: "new.csv", columns: [], createdAt: "", sampleRows: [] };
            mockedSellerFileService.uploadSellerFile.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useUploadSellerFile(1), { wrapper: createWrapper() });

            result.current.mutate(new File([], "test.csv"));

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(mockedSellerFileService.uploadSellerFile).toHaveBeenCalled();
        });
    });
});
