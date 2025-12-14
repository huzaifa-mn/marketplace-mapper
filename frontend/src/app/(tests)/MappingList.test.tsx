import { render, screen } from "@testing-library/react";
import { useMappings } from "@/hooks/useMappingHooks";
import MappingList from "@/components/mappings/MappingList";

jest.mock("@/hooks/useMappingHooks");
jest.mock("@/components/ui/skeleton", () => ({
    Skeleton: () => <div role="status" data-testid="skeleton" />
}));

const mockedUseMappings = useMappings as jest.MockedFunction<
    typeof useMappings
>;

function setupMock(value: any) {
    mockedUseMappings.mockReturnValue(value);
}

describe("MappingList", () => {
    it("shows loading skeleton", () => {
        setupMock({ data: null, isLoading: true, error: null });

        render(<MappingList />);

        expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("shows empty state", () => {
        setupMock({
            data: { items: [] },
            isLoading: false,
            error: null,
        });

        render(<MappingList />);

        expect(
            screen.getByText(/No mappings yet/i),
        ).toBeInTheDocument();
    });

    it("renders mappings table with data", () => {
        setupMock({
            isLoading: false,
            error: null,
            data: {
                page: 1,
                totalPages: 2,
                items: [
                    {
                        id: 1,
                        marketplaceTemplateId: 10,
                        sellerFileId: 5,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        });

        render(<MappingList />);

        // header
        expect(screen.getByText(/Saved Mappings/i)).toBeInTheDocument();
        // row cells
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /View/i }),
        ).toBeInTheDocument();
    });
});
