import { marketplaceService, CreateMarketplaceTemplatePayload } from "../marketplaceService";
import { apiGet, apiPostFormData } from "@/lib/api-manager";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

jest.mock("@/lib/api-manager");
jest.mock("@/lib/api-endpoints", () => ({
    API_ENDPOINTS: {
        MARKETPLACE_TEMPLATES: "/marketplaces/templates",
    },
    getApiBaseUrl: () => "http://localhost:4000",
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPostFormData = apiPostFormData as jest.MockedFunction<typeof apiPostFormData>;

describe("marketplaceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getTemplates", () => {
        it("calls apiGet with correct URL", async () => {
            const mockResponse = { items: [], page: 1, total: 0, totalPages: 1 };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await marketplaceService.getTemplates(2);

            expect(mockedApiGet).toHaveBeenCalledWith("/marketplaces/templates?page=2");
            expect(result).toEqual(mockResponse);
        });

        it("defaults page to 1", async () => {
            await marketplaceService.getTemplates();
            expect(mockedApiGet).toHaveBeenCalledWith("/marketplaces/templates?page=1");
        });
    });

    describe("getTemplateById", () => {
        it("calls apiGet with correct ID", async () => {
            const mockResponse = { id: 1, name: "Test" };
            mockedApiGet.mockResolvedValue(mockResponse);

            const result = await marketplaceService.getTemplateById(1);

            expect(mockedApiGet).toHaveBeenCalledWith("/marketplaces/templates/1");
            expect(result).toEqual(mockResponse);
        });
    });

    describe("createTemplate", () => {
        it("calls apiPostFormData with correct data", async () => {
            const payload: CreateMarketplaceTemplatePayload = {
                name: "New Template",
                file: new File(["content"], "test.csv", { type: "text/csv" }),
            };
            const mockResponse = { id: 2, name: "New Template" };
            mockedApiPostFormData.mockResolvedValue(mockResponse);

            const result = await marketplaceService.createTemplate(payload);

            expect(mockedApiPostFormData).toHaveBeenCalledWith(
                "/marketplaces/templates",
                expect.any(FormData)
            );
            expect(result).toEqual(mockResponse);

            // Verify FormData content
            const formData = mockedApiPostFormData.mock.calls[0][1];
            expect(formData.get("name")).toBe("New Template");
            expect(formData.get("file")).toBeInstanceOf(File);
        });
    });
});
