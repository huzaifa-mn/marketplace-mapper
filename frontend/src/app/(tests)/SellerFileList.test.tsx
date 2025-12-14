import { render, screen } from "@testing-library/react";
import { useSellerFiles, useUploadSellerFile } from "@/hooks/useSellerFilesHooks";
import SellerFileList from "@/components/seller-files/SellerFileList";

jest.mock("@/hooks/useSellerFilesHooks");
jest.mock("@/components/ui/skeleton", () => ({
    Skeleton: () => <div role="status" data-testid="skeleton" />
}));

const mockedUseSellerFiles = useSellerFiles as jest.MockedFunction<typeof useSellerFiles>;
const mockedUseUploadSellerFile = useUploadSellerFile as jest.MockedFunction<typeof useUploadSellerFile>;

function setupMock(value: any) {
    mockedUseSellerFiles.mockReturnValue(value);
    mockedUseUploadSellerFile.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
    } as any);
}

describe("SellerFileList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupMock({ data: null, isLoading: true, error: null });
    });

    it("shows loading skeleton", () => {
        setupMock({ data: null, isLoading: true, error: null });

        render(<SellerFileList />);

        expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("shows empty state", () => {
        setupMock({ data: { items: [], page: 1, totalPages: 1 }, isLoading: false, error: null });

        render(<SellerFileList />);

        expect(screen.getByText(/No seller files yet/i)).toBeInTheDocument();
    });

    it("renders table when data present", () => {
        setupMock({
            isLoading: false,
            error: null,
            data: {
                page: 1,
                totalPages: 1,
                items: [
                    {
                        id: 1,
                        fileName: "file.csv",
                        columns: ["sku", "name"],
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        });

        render(<SellerFileList />);

        expect(screen.getByText("file.csv")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /view/i })).toBeInTheDocument();
    });
});
