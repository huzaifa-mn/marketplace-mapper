import { render, screen } from "@testing-library/react";
import { useMarketplaceTemplates } from "@/hooks/useMarketplaceHooks";
import MarketplaceTemplateList from "@/components/marketplaces/MarketplaceTemplateList";

jest.mock("@/hooks/useMarketplaceHooks");
jest.mock("@/components/ui/skeleton", () => ({
    Skeleton: () => <div role="status" data-testid="skeleton" />
}));
jest.mock("@/components/marketplaces/MarketplaceTemplateForm", () => () => <div data-testid="marketplace-template-form" />);

const mockedUseMarketplaceTemplates = useMarketplaceTemplates as jest.MockedFunction<
    typeof useMarketplaceTemplates
>;

function setupMock(value: any) {
    mockedUseMarketplaceTemplates.mockReturnValue(value);
}

describe("MarketplaceTemplateList", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows loading skeleton", () => {
        setupMock({ data: null, isLoading: true, error: null });

        render(<MarketplaceTemplateList />);

        expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("shows empty state", () => {
        setupMock({ data: { items: [], page: 1, totalPages: 1 }, isLoading: false, error: null });

        render(<MarketplaceTemplateList />);

        expect(
            screen.getByText(/No marketplace templates yet/i),
        ).toBeInTheDocument();
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
                        name: "Amazon US",
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        });

        render(<MarketplaceTemplateList />);

        expect(screen.getByText("Amazon US")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /View/i }),
        ).toBeInTheDocument();
    });
});
