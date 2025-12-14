import { sellerFileService } from "../sellerFileService";
import { apiGet, apiPostFormData } from "@/lib/api-manager";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

jest.mock("@/lib/api-manager");
jest.mock("@/lib/api-endpoints", () => ({
    API_ENDPOINTS: {
        SELLER_FILES: "/seller-files",
    },
    getApiBaseUrl: () => "http://localhost:4000",
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPostFormData = apiPostFormData as jest.MockedFunction<typeof apiPostFormData>;

describe("sellerFileService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getSellerFiles", () => {
        it("calls apiGet with default page", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1 };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await sellerFileService.getSellerFiles();

            expect(mockedApiGet).toHaveBeenCalledWith("/seller-files?page=1");
            expect(result).toEqual(mockResponse);
        });

        it("calls apiGet with specific page", async () => {
            await sellerFileService.getSellerFiles(3);
            expect(mockedApiGet).toHaveBeenCalledWith("/seller-files?page=3");
        });
    });

    describe("getSellerFileById", () => {
        it("calls apiGet with correct ID", async () => {
            const mockResponse = { id: 1, fileName: "test.csv" };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await sellerFileService.getSellerFileById(1);

            expect(mockedApiGet).toHaveBeenCalledWith("/seller-files/1");
            expect(result).toEqual(mockResponse);
        });
    });

    describe("uploadSellerFile", () => {
        it("calls apiPostFormData with correct data", async () => {
            const file = new File(["content"], "test.csv", { type: "text/csv" });
            const mockResponse = { id: 2, fileName: "test.csv" };
            mockedApiPostFormData.mockResolvedValue(mockResponse);

            const result = await sellerFileService.uploadSellerFile(file);

            expect(mockedApiPostFormData).toHaveBeenCalledWith(
                "/seller-files",
                expect.any(FormData)
            );
            expect(result).toEqual(mockResponse);

            const formData = mockedApiPostFormData.mock.calls[0][1];
            expect(formData.get("file")).toBeInstanceOf(File);
        });
    });
});
