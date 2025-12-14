import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMarketplaceTemplates } from "@/hooks/useMarketplaceHooks";
import { useSellerFiles } from "@/hooks/useSellerFilesHooks";
import { useCreateMapping } from "@/hooks/useMappingHooks";
import { useMappingUiStore } from "@/stores/useUiMappingStore";
import MappingBuilder from "@/components/mappings/MappingBuilder";

jest.mock("@/hooks/useMarketplaceHooks");
jest.mock("@/hooks/useSellerFilesHooks");
jest.mock("@/hooks/useMappingHooks");
jest.mock("@/stores/useUiMappingStore");

const mockedUseMarketplaceTemplates =
    useMarketplaceTemplates as jest.MockedFunction<typeof useMarketplaceTemplates>;
const mockedUseSellerFiles =
    useSellerFiles as jest.MockedFunction<typeof useSellerFiles>;
const mockedUseCreateMapping =
    useCreateMapping as jest.MockedFunction<typeof useCreateMapping>;
const mockedUseMappingUiStore =
    useMappingUiStore as unknown as jest.MockedFunction<typeof useMappingUiStore>;

function setupStore(overrides: Partial<ReturnType<typeof useMappingUiStore>> = {}) {
    mockedUseMappingUiStore.mockReturnValue({
        selectedMarketplaceTemplateId: null,
        selectedSellerFileId: null,
        attributeMappings: {},
        setSelectedMarketplaceTemplateId: jest.fn(),
        setSelectedSellerFileId: jest.fn(),
        setAttributeMapping: jest.fn(),
        isColumnAlreadyMapped: () => false,
        ...overrides,
    } as any);
}

function setupData() {
    mockedUseMarketplaceTemplates.mockReturnValue({
        data: {
            items: [
                {
                    id: 1,
                    name: "Amazon Template",
                    attributes: [
                        { id: 101, name: "Title" },
                        { id: 102, name: "SKU" },
                    ],
                },
            ],
        },
        isLoading: false,
        error: null,
    } as any);

    mockedUseSellerFiles.mockReturnValue({
        data: {
            items: [
                {
                    id: 10,
                    fileName: "products.csv",
                    columns: ["name", "sku", "price"],
                },
            ],
        },
        isLoading: false,
        error: null,
    } as any);
}

describe("MappingBuilder", () => {
    it("renders template and file selects", () => {
        setupStore();
        setupData();
        mockedUseCreateMapping.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            error: null,
        } as any);

        render(<MappingBuilder />);

        expect(
            screen.getByText("Marketplace Template", { selector: "p" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Seller File", { selector: "p" })).toBeInTheDocument();
    });

    it("shows mapping description when both selections are set", () => {
        setupData();
        setupStore({
            selectedMarketplaceTemplateId: 1,
            selectedSellerFileId: 10,
        });
        mockedUseCreateMapping.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            error: null,
        } as any);

        render(<MappingBuilder />);

        expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'p' && content.includes('Mapping'))).toBeInTheDocument();
        expect(screen.getAllByText("Amazon Template").length).toBeGreaterThan(0);
        expect(screen.getAllByText("products.csv").length).toBeGreaterThan(0);

        expect(
            screen.getByText(/Attribute Mapping/i),
        ).toBeInTheDocument();
    });

    it("disables already mapped seller columns", async () => {
        const user = userEvent.setup();
        setupData();

        // Pretend attribute 101 already mapped to "name"
        setupStore({
            selectedMarketplaceTemplateId: 1,
            selectedSellerFileId: 10,
            attributeMappings: { 101: "name" },
            isColumnAlreadyMapped: (col: string) => col === "name",
        });

        mockedUseCreateMapping.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            error: null,
        } as any);

        render(<MappingBuilder />);

        // Open seller column select for second attribute ("SKU")
        // The one that has "Select column" as text (placeholder)
        const triggers = screen.getAllByRole("combobox");
        // 0: Template, 1: File, 2: Attr 1 (value="name"), 3: Attr 2 (value="Select column")
        const secondAttributeTrigger = triggers[3];

        await user.click(secondAttributeTrigger);

        // Option "name" should be disabled for SKU row
        const optionItem = screen.getByRole("option", { name: "name" });
        expect(optionItem).toHaveAttribute("aria-disabled", "true");
    });

    it("calls mutate with mapped items when Save Mapping clicked", async () => {
        const user = userEvent.setup();
        setupData();

        const setAttributeMapping = jest.fn();
        setupStore({
            selectedMarketplaceTemplateId: 1,
            selectedSellerFileId: 10,
            attributeMappings: {
                101: "name",
                102: "sku",
            },
            setAttributeMapping,
        });

        const mutate = jest.fn();
        mockedUseCreateMapping.mockReturnValue({
            mutate,
            isPending: false,
            error: null,
        } as any);

        render(<MappingBuilder />);

        const saveButton = screen.getByRole("button", { name: /Save Mapping/i });
        await user.click(saveButton);

        expect(mutate).toHaveBeenCalledWith({
            marketplaceTemplateId: 1,
            sellerFileId: 10,
            items: [
                { marketplaceAttributeId: 101, sellerColumnName: "name" },
                { marketplaceAttributeId: 102, sellerColumnName: "sku" },
            ],
        });
    });

    it("does not call mutate when no attributes mapped", async () => {
        const user = userEvent.setup();
        setupData();

        setupStore({
            selectedMarketplaceTemplateId: 1,
            selectedSellerFileId: 10,
            attributeMappings: {}, // nothing mapped
        });

        const mutate = jest.fn();
        mockedUseCreateMapping.mockReturnValue({
            mutate,
            isPending: false,
            error: null,
        } as any);

        render(<MappingBuilder />);

        const saveButton = screen.getByRole("button", { name: /Save Mapping/i });
        await user.click(saveButton);

        expect(mutate).not.toHaveBeenCalled();
    });

    it("shows error alert from mutation", () => {
        setupData();
        setupStore();
        mockedUseCreateMapping.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
            error: { message: "Boom" },
        } as any);

        render(<MappingBuilder />);

        expect(screen.getByText(/Boom/i)).toBeInTheDocument();
    });
});
