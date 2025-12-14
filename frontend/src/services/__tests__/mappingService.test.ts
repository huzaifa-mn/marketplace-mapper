import { mappingService, CreateMappingInput } from "../mappingService";
import { apiGet, apiPostJson } from "@/lib/api-manager";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

jest.mock("@/lib/api-manager");
jest.mock("@/lib/api-endpoints", () => ({
    API_ENDPOINTS: {
        MAPPINGS: "/mappings",
    },
    getApiBaseUrl: () => "http://localhost:4000",
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPostJson = apiPostJson as jest.MockedFunction<typeof apiPostJson>;

describe("mappingService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getMappings", () => {
        it("calls apiGet with default page", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1 };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await mappingService.getMappings();

            expect(mockedApiGet).toHaveBeenCalledWith("/mappings?page=1");
            expect(result).toEqual(mockResponse);
        });

        it("calls apiGet with specific page", async () => {
            await mappingService.getMappings(2);
            expect(mockedApiGet).toHaveBeenCalledWith("/mappings?page=2");
        });
    });

    describe("getMappingById", () => {
        it("calls apiGet with correct ID", async () => {
            const mockResponse = { id: 1, name: "Mapping" };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await mappingService.getMappingById(1);

            expect(mockedApiGet).toHaveBeenCalledWith("/mappings/1");
            expect(result).toEqual(mockResponse);
        });
    });

    describe("createMapping", () => {
        it("calls apiPostJson with correct payload", async () => {
            const payload: CreateMappingInput = {
                marketplaceTemplateId: 1,
                sellerFileId: 2,
                items: [{ marketplaceAttributeId: 1, sellerColumnName: "sku" }],
            };
            const mockResponse = { id: 3, ...payload };
            mockedApiPostJson.mockResolvedValue(mockResponse);

            const result = await mappingService.createMapping(payload);

            expect(mockedApiPostJson).toHaveBeenCalledWith(
                "/mappings",
                payload
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
