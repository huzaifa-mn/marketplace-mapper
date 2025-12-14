import { render, screen } from "@testing-library/react";
import { useSellerFile } from "@/hooks/useSellerFilesHooks";
import SellerFileDetail from "@/app/seller-files/[id]/page";

jest.mock("next/navigation", () => ({
    useParams: () => ({ id: "1" }),
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => "",
    useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/components/ui/skeleton", () => ({
    Skeleton: () => <div role="status" data-testid="skeleton" />
}));

// mock data hook
jest.mock("@/hooks/useSellerFilesHooks");

const mockedUseSellerFile = useSellerFile as jest.MockedFunction<
    typeof useSellerFile
>;

function setupMock(value: any) {
    mockedUseSellerFile.mockReturnValue(value);
}

describe("SellerFileDetail", () => {
    it("renders loading state", () => {
        setupMock({ data: null, isLoading: true, error: null });

        render(<SellerFileDetail />);

        // from your skeleton view: 2 skeletons
        expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("renders error state", () => {
        setupMock({ data: null, isLoading: false, error: new Error("fail") });

        render(<SellerFileDetail />);

        expect(
            screen.getByText(/Error loading file details/i),
        ).toBeInTheDocument();
    });

    it("renders file details with list tab", () => {
        const sampleData = {
            id: 1,
            fileName: "products.csv",
            createdAt: new Date().toISOString(),
            columns: ["sku", "name", "price"],
            sampleRows: [
                { sku: "SKU1", name: "Product 1", price: "10" },
                { sku: "SKU2", name: "Product 2", price: "20" },
            ],
        };

        setupMock({ data: sampleData as any, isLoading: false, error: null });

        render(<SellerFileDetail />);

        // header text - use heading role to be specific
        expect(screen.getByRole("heading", { name: "products.csv" })).toBeInTheDocument();

        // meta cards
        expect(screen.getByText(/Total Columns/i)).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();

        // list tab default: product attributes title appears
        expect(screen.getAllByText(/Product Attributes/i).length).toBeGreaterThan(0);
        // one SKU from list
        expect(screen.getByText("SKU1")).toBeInTheDocument();
    });
});
